"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { agents } from "@/lib/data/agents";
import { shortenAddress } from "@/lib/utils";
import { abis, erc20Abi, getContractAddress, getUsdmAddress } from "@/lib/contracts";

const statusTone = { Active: "forest", Pending: "warning", Suspended: "danger" } as const;

function RegistrationPanel() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const registryAddress = getContractAddress(chainId, "CeloHTAgentRegistry");
  const usdmAddress = getUsdmAddress(chainId);
  const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
  const [registrationHash, setRegistrationHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const approvalStarted = useRef(false);
  const { writeContractAsync, isPending } = useWriteContract();
  const fee = useReadContract({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "registrationFee", query: { enabled: Boolean(registryAddress) } });
  const allowance = useReadContract({ address: usdmAddress, abi: erc20Abi, functionName: "allowance", args: address && registryAddress ? [address, registryAddress] : undefined, query: { enabled: Boolean(address && registryAddress && usdmAddress) } });
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalHash });
  const registrationReceipt = useWaitForTransactionReceipt({ hash: registrationHash });

  async function register() {
    if (!registryAddress || !usdmAddress || typeof fee.data !== "bigint" || !isConnected) return;
    setError(undefined);
    try {
      if (allowance.data === undefined || allowance.data < fee.data) setApprovalHash(await writeContractAsync({ address: usdmAddress, abi: erc20Abi, functionName: "approve", args: [registryAddress, fee.data] }));
      else setRegistrationHash(await writeContractAsync({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "registerAgent" }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Agent registration failed."); }
  }

  useEffect(() => {
    if (!approvalReceipt.isSuccess || registrationHash || approvalStarted.current || !registryAddress) return;
    approvalStarted.current = true;
    void writeContractAsync({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "registerAgent" })
      .then(setRegistrationHash)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Agent registration failed."));
  }, [approvalReceipt.isSuccess, registrationHash, registryAddress, writeContractAsync]);

  return <Section eyebrow="On-chain registration" title="Register as an agent"><p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">Registration uses the official CeloHTAgentRegistry fee and does not perform identity verification on-chain.</p><Button className="mt-4" onClick={register} disabled={!isConnected || !registryAddress || !usdmAddress || typeof fee.data !== "bigint" || isPending || Boolean(approvalHash || registrationHash)}>{isPending ? "Confirm in wallet…" : "Register agent"}</Button>{approvalHash && !approvalReceipt.isSuccess && <p className="mt-3 text-sm">USDm approval pending confirmation.</p>}{registrationHash && !registrationReceipt.isSuccess && <p className="mt-3 text-sm">Registration submitted, waiting for confirmation.</p>}{registrationReceipt.isSuccess && <p className="mt-3 text-sm text-forest-600">Agent registration confirmed on-chain.</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</Section>;
}

export default function AgentsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Agents" }]} />
      <PageHero
        eyebrow="Pillar 02 · Agent Network"
        title="Trained people, not just an app"
        lead="Browse the current directory and verify each agent's status before requesting a service. Directory entries are sample data until an indexer and profile service are configured."
      />

      <Section eyebrow={`${agents.length} directory entries · SAMPLE`} title="Directory">
        <Button asChild variant="secondary" className="mb-6">
          <Link href="/agents/map">View on map</Link>
        </Button>
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((agent) => (
            <Card key={agent.address}>
              <CardHeader>
                <CardTitle>{agent.displayName}</CardTitle>
                <Badge tone={statusTone[agent.status]}>{agent.status}</Badge>
              </CardHeader>
              <CardDescription>{agent.region}</CardDescription>
              <p className="text-ink-soft dark:text-parchment-100/50 mt-3 font-mono text-xs">
                {shortenAddress(agent.address)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.services.map((service) => (
                  <Badge key={service} tone="neutral">
                    {service}
                  </Badge>
                ))}
              </div>
              {agent.rating > 0 && (
                <p className="text-ink-soft dark:text-parchment-100/70 mt-3 text-sm">
                  ★ {agent.rating.toFixed(1)} community rating
                </p>
              )}
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Want to become an agent?" title="">
        <p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">
          Agents self-register on-chain via <code>CeloHTAgentRegistry.registerAgent</code> after
          completing the education program, then wait for approval from a network coordinator. See
          the flagship repository&rsquo;s{" "}
          <a
            href="https://github.com/Celo-HaiTi/celoht/blob/main/docs/agent-network.md"
            className="underline underline-offset-2"
          >
            agent network documentation
          </a>{" "}
          for the full process.
        </p>
      </Section>
      <RegistrationPanel />
    </>
  );
}
