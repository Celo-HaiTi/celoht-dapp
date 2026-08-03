"use client";

import Link from "next/link";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BalanceDisplay } from "@/components/web3/BalanceDisplay";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const certificatesDeployed = isContractDeployed(chainId, "CertificateRegistry");
  const agentDeployed = isContractDeployed(chainId, "AgentRegistry");

  const certificates = useReadContract({
    address: getContractAddress(chainId, "CertificateRegistry"),
    abi: abis.CertificateRegistry,
    functionName: "certificatesOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && certificatesDeployed },
  });

  const agentStatus = useReadContract({
    address: getContractAddress(chainId, "AgentRegistry"),
    abi: abis.AgentRegistry,
    functionName: "isActiveAgent",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && agentDeployed },
  });

  return (
    <>
      <PageHero
        eyebrow="Dashboard"
        title={isConnected ? "Welcome back" : "Connect your wallet to get started"}
        lead={
          isConnected
            ? "Here's a quick view of your CeloHT activity across all three pillars."
            : "Connect a Valora-compatible wallet using the button in the header to see your balances, certificates, and agent status."
        }
      />

      {!isConnected ? (
        <Section>
          <Card className="max-w-md">
            <CardTitle>No wallet connected</CardTitle>
            <CardDescription className="mt-2">
              Your dashboard, certificates, and transaction history are all tied to your connected
              wallet. Nothing here requires giving CeloHT custody of your funds.
            </CardDescription>
          </Card>
        </Section>
      ) : (
        <>
          <Section eyebrow="Wallet" title="Balances">
            <BalanceDisplay />
          </Section>

          <Section eyebrow="Education" title="Certificates">
            {!certificatesDeployed ? (
              <p className="text-ink-soft dark:text-parchment-100/70 text-sm">
                CertificateRegistry isn&rsquo;t deployed on this network yet.
              </p>
            ) : certificates.isLoading ? (
              <p className="text-ink-soft dark:text-parchment-100/70 text-sm">Loading…</p>
            ) : (
              <p className="text-ink-soft dark:text-parchment-100/70 text-sm">
                You hold{" "}
                <strong className="text-ink dark:text-parchment-100">
                  {certificates.data ? (certificates.data as bigint[]).length : 0}
                </strong>{" "}
                certificate(s).{" "}
                <Link href="/certificates" className="underline underline-offset-2">
                  View all
                </Link>
              </p>
            )}
          </Section>

          <Section eyebrow="Agent Network" title="Your agent status">
            {!agentDeployed ? (
              <p className="text-ink-soft dark:text-parchment-100/70 text-sm">
                AgentRegistry isn&rsquo;t deployed on this network yet.
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <Badge tone={agentStatus.data ? "forest" : "neutral"}>
                  {agentStatus.data ? "Active agent" : "Not a registered agent"}
                </Badge>
                {!agentStatus.data && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/agents">Learn how to become an agent</Link>
                  </Button>
                )}
              </div>
            )}
          </Section>
        </>
      )}

      <Section eyebrow="Quick links" title="Jump to a pillar">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardTitle>Education</CardTitle>
            <CardDescription className="mt-2">Courses and progress tracking.</CardDescription>
            <Link
              href="/education/courses"
              className="text-gold-800 dark:text-gold-300 mt-4 inline-block text-sm font-medium"
            >
              Browse courses →
            </Link>
          </Card>
          <Card>
            <CardTitle>Agent Network</CardTitle>
            <CardDescription className="mt-2">Find an agent near you.</CardDescription>
            <Link
              href="/agents/map"
              className="text-gold-800 dark:text-gold-300 mt-4 inline-block text-sm font-medium"
            >
              Open the map →
            </Link>
          </Card>
          <Card>
            <CardTitle>Reforestation</CardTitle>
            <CardDescription className="mt-2">Support a verified project.</CardDescription>
            <Link
              href="/donations"
              className="text-gold-800 dark:text-gold-300 mt-4 inline-block text-sm font-medium"
            >
              Donate →
            </Link>
          </Card>
        </div>
      </Section>
    </>
  );
}
