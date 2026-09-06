"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const agentDeployed = isContractDeployed(chainId, "CeloHTAgentRegistry");
  const agentId = useReadContract({ address: getContractAddress(chainId, "CeloHTAgentRegistry"), abi: abis.CeloHTAgentRegistry, functionName: "agentIdOf", args: address ? [address] : undefined, query: { enabled: Boolean(address && agentDeployed) } });

  const registeredAgentId = agentId.data as bigint | undefined;
  return <><Breadcrumbs items={[{ label: "Dashboard" }]} /><PageHero eyebrow="Dashboard" title={isConnected ? "Welcome back" : "Connect your wallet to get started"} lead="Review your CeloHT wallet activity and official contract status." /><Section><Card className="max-w-xl"><CardTitle>Agent status</CardTitle><CardDescription className="mt-2">{!isConnected ? "Connect your wallet to check your agent status." : !agentDeployed ? "CeloHTAgentRegistry is unavailable on this network." : agentId.isLoading ? "Loading…" : registeredAgentId && registeredAgentId > 0n ? `Registered agent ID: ${registeredAgentId.toString()}.` : "This wallet is not registered as an agent."}</CardDescription></Card></Section></>;
}
