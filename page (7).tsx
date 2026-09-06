"use client";

import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { proposals } from "@/lib/data/proposals";

export default function GovernancePage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { push } = useToast();
  const deployed = isContractDeployed(chainId, "CeloHTGovernance");
  const votingAddress = getContractAddress(chainId, "CeloHTGovernance");

  const participationFee = useReadContract({
    address: votingAddress,
    abi: abis.CeloHTGovernance,
    functionName: "participationFee",
    query: { enabled: isConnected && deployed },
  });

  const { writeContract, isPending } = useWriteContract();

  function castVote(proposalId: number, support: boolean) {
    if (!votingAddress) return;
    writeContract(
      {
        address: votingAddress,
        abi: abis.CeloHTGovernance,
        functionName: "vote",
        args: [BigInt(proposalId), support ? 1 : 2],
      },
      {
        onSuccess: () => push({ title: "Vote submitted", tone: "success" }),
        onError: (error) =>
          push({ title: "Vote failed", description: error.message, tone: "error" }),
      },
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Governance" }]} />
      <PageHero
        eyebrow="Governance"
        title="Role-based voting — no governance token"
        lead="CeloHT doesn't have a token, so voting weight isn't for sale: one address, one vote, limited to addresses the Maintainer Council has granted VOTER_ROLE."
      />

      <Section>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <CardTitle>{proposal.title}</CardTitle>
                <Badge tone={proposal.status === "Active" ? "gold" : "neutral"}>
                  {proposal.status}
                </Badge>
              </CardHeader>
              <CardDescription>{proposal.summary}</CardDescription>
              <p className="text-ink-soft dark:text-parchment-100/50 mt-3 text-xs">
                Proposed by {proposal.proposer} · {proposal.votesFor} for · {proposal.votesAgainst}{" "}
                against
              </p>

              {!deployed ? (
                <p className="text-ink-soft dark:text-parchment-100/50 mt-4 text-xs">
                  CeloHTGovernance isn&rsquo;t deployed on this network yet — showing sample data.
                </p>
              ) : !isConnected ? (
                <p className="text-ink-soft dark:text-parchment-100/50 mt-4 text-xs">
                  Connect your wallet to vote, if you are authorized to propose and vote.
                </p>
              ) : (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() => castVote(proposal.id, true)}
                  >
                    Vote for
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => castVote(proposal.id, false)}
                  >
                    Vote against
                  </Button>
                </div>
              )}
              {deployed && isConnected && <p className="text-ink-soft dark:text-parchment-100/50 mt-3 text-xs">Participation fee: {participationFee.data == null ? "Loading" : `${String(participationFee.data)} USDm base units`}.</p>}
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Why not token voting?" title="">
        <p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">
          A token-weighted vote can be bought. CeloHT deliberately trades permissionless
          participation for resistance to plutocratic and Sybil attacks — see the CeloHTGovernance
          contract&rsquo;s NatSpec and{" "}
          <a
            href="https://github.com/Celo-HaiTi/celoht/blob/main/GOVERNANCE.md"
            className="underline underline-offset-2"
          >
            the flagship repository&rsquo;s governance policy
          </a>{" "}
          for the full reasoning and the path toward broader participation over time.
        </p>
      </Section>
    </>
  );
}
