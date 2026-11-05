"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits, type Address } from "viem";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { abis, getContractAddress, getUsdmAddress, isContractDeployed } from "@/lib/contracts";
import { getBackendGovernance, isBackendConfigured, type BackendGovernance } from "@/lib/backend";
import { supportedNetworkConfig } from "@/lib/network/config";
import { useWalletChainId } from "@/lib/web3/useWalletChainId";

type GovernanceFeedState =
  | { walletAddress: Address | undefined; status: "ready"; data: BackendGovernance }
  | { walletAddress: Address | undefined; status: "error" };

export default function GovernancePage() {
  const { address, isConnected } = useAccount();
  const chainId = useWalletChainId();
  const isSepolia = chainId === supportedNetworkConfig.id;
  const walletAddress = isConnected && isSepolia ? address : undefined;
  const governanceAddress = getContractAddress(chainId, "CeloHTGovernance");
  const configured = isContractDeployed(chainId, "CeloHTGovernance") && Boolean(getUsdmAddress(chainId));
  const participationFee = useReadContract({ address: governanceAddress, abi: abis.CeloHTGovernance, functionName: "participationFee", query: { enabled: configured } });
  const [feedState, setFeedState] = useState<GovernanceFeedState | null>(null);

  useEffect(() => {
    let active = true;

    getBackendGovernance(walletAddress)
      .then((result) => {
        const expectedGovernance = getContractAddress(supportedNetworkConfig.id, "CeloHTGovernance");
        const expectedUsdm = getUsdmAddress(supportedNetworkConfig.id);
        const deploymentMatches = result.contract.chainId === supportedNetworkConfig.id
          && result.contract.address.toLowerCase() === expectedGovernance?.toLowerCase()
          && result.contract.usdmAddress.toLowerCase() === expectedUsdm?.toLowerCase();

        if (!deploymentMatches) {
          throw new Error("Governance deployment does not match the configured Celo Sepolia contracts.");
        }
        if (active) setFeedState({ walletAddress, status: "ready", data: result });
      })
      .catch(() => {
        if (active) setFeedState({ walletAddress, status: "error" });
      });

    return () => { active = false; };
  }, [walletAddress]);

  const backendConfigured = isBackendConfigured();
  const feedMatchesWallet = feedState !== null && feedState.walletAddress === walletAddress;
  const loading = !feedMatchesWallet;
  const feedError = feedMatchesWallet && feedState.status === "error";
  const governance = feedMatchesWallet && feedState.status === "ready" ? feedState.data : null;

  return <>
    <Breadcrumbs items={[{ label: "Governance" }]} />
    <PageHero
      eyebrow="Governance"
      title="Governance proposals"
      lead="Read the indexed Celo Sepolia proposal record. The Governance Council remains CeloHT's highest ongoing collective decision-making body."
    />
    <Section eyebrow="Celo Sepolia" title="Proposal feed">
      {!backendConfigured ? (
        <p role="status">The governance API is not configured for this deployment.</p>
      ) : loading ? (
        <p role="status">Loading proposals from the governance API...</p>
      ) : feedError ? (
        <p role="alert">The live governance feed is unavailable or its deployment could not be verified.</p>
      ) : governance?.proposals.length === 0 ? (
        <p role="status">The verified governance API returned no proposals.</p>
      ) : governance ? (
        <div className="grid max-w-4xl gap-4">
          {governance.proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <CardTitle>{proposal.title || `Proposal ${proposal.onChainProposalId}`}</CardTitle>
                <CardDescription>
                  Proposal {proposal.onChainProposalId} · {proposal.status.replaceAll("_", " ")}
                </CardDescription>
              </CardHeader>
              {proposal.description && <p className="text-sm text-ink-soft dark:text-parchment-100/70">{proposal.description}</p>}
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="font-medium">Proposer</dt><dd className="break-all">{proposal.proposer}</dd></div>
                <div><dt className="font-medium">Voting period</dt><dd><time dateTime={proposal.votingStartsAt}>{proposal.votingStartsAt}</time> to <time dateTime={proposal.votingEndsAt}>{proposal.votingEndsAt}</time></dd></div>
                <div><dt className="font-medium">For</dt><dd>{proposal.votes.for}</dd></div>
                <div><dt className="font-medium">Against</dt><dd>{proposal.votes.against}</dd></div>
                <div><dt className="font-medium">Abstain</dt><dd>{proposal.votes.abstain}</dd></div>
                <div><dt className="font-medium">Finalized</dt><dd>{proposal.finalized ? "Yes" : "No"}</dd></div>
              </dl>
              {proposal.walletVoteState && walletAddress && (
                <p className="mt-4 text-sm">Connected wallet vote recorded: {proposal.walletVoteState.hasVoted ? "Yes" : "No"}</p>
              )}
            </Card>
          ))}
        </div>
      ) : null}
    </Section>
    <Section eyebrow="Network" title="Verified deployment">
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>CeloHT Governance</CardTitle></CardHeader>
        <CardDescription>
          Celo Sepolia · chain {supportedNetworkConfig.id} · {governance?.contract.address ?? getContractAddress(supportedNetworkConfig.id, "CeloHTGovernance") ?? "address unavailable"}
        </CardDescription>
        <p className="mt-3 text-sm text-ink-soft dark:text-parchment-100/70">
          {isConnected && !isSepolia
            ? "Your wallet is on a different network. Proposal details are read-only; switch to Celo Sepolia to inspect wallet-specific governance state."
            : `On-chain participation fee: ${configured && typeof participationFee.data === "bigint" ? `${formatUnits(participationFee.data, supportedNetworkConfig.tokens.usdm.decimals)} USDm` : "Unavailable on the connected network"}.`}
        </p>
        <p className="mt-3 text-sm text-ink-soft dark:text-parchment-100/70">This page is read-only. It does not grant proposer authority or submit votes.</p>
      </Card>
    </Section>
  </>;
}
