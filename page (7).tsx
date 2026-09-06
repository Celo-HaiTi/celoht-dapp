"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { abis, getContractAddress, getUsdmAddress, isContractDeployed } from "@/lib/contracts";

export default function GovernancePage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const governanceAddress = getContractAddress(chainId, "CeloHTGovernance");
  const configured = isContractDeployed(chainId, "CeloHTGovernance") && Boolean(getUsdmAddress(chainId));
  const participationFee = useReadContract({ address: governanceAddress, abi: abis.CeloHTGovernance, functionName: "participationFee", query: { enabled: configured } });

  return <><Breadcrumbs items={[{ label: "Governance" }]} /><PageHero eyebrow="Governance" title="Advisory community voting" lead="CeloHTGovernance uses one wallet, one vote and a USDm participation fee. Proposal indexing is not yet configured in this static frontend." /><Section><Card className="max-w-2xl"><CardHeader><CardTitle>Live proposal feed unavailable</CardTitle></CardHeader><CardDescription>{!isConnected ? "Connect a wallet to inspect the configured governance network." : !configured ? "CeloHTGovernance and USDm are unavailable on this network." : `The official governance contract is configured. Participation fee: ${participationFee.data == null ? "Unavailable" : `${String(participationFee.data)} USDm base units`}. A backend/indexer is required before proposal records can be displayed or voted on safely.`}</CardDescription></Card></Section><Section eyebrow="Boundary" title="No fabricated governance data"><p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">This page does not display sample proposals as live governance, does not invent proposal IDs, and does not submit votes against local demo records. Proposal creation requires the contract&rsquo;s authorized proposer role and a server/indexer boundary to expose real records.</p></Section></>;
}
