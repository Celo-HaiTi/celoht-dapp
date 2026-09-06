"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";

export default function CertificatesPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const deployed = isContractDeployed(chainId, "CeloHTEducation");
  const educationAddress = getContractAddress(chainId, "CeloHTEducation");
  const eligiblePayments = useReadContract({ address: educationAddress, abi: abis.CeloHTEducation, functionName: "eligiblePayments", args: address ? [address] : undefined, query: { enabled: Boolean(address && deployed) } });

  return <><Breadcrumbs items={[{ label: "Certificates" }]} /><PageHero eyebrow="Education · Certificates" title="Your learning record, on-chain" lead="CeloHTEducation records paid eligibility and certificate issuance separately. Payment never pretends to be a certificate." /><Section><Card className="max-w-xl"><CardTitle>{!isConnected ? "Connect your wallet" : !deployed ? "Education unavailable on this network" : "Certificate eligibility"}</CardTitle><CardDescription className="mt-2">{!isConnected ? "Connect your wallet to check certificate eligibility." : !deployed ? "CeloHTEducation is deployed on Celo Sepolia." : eligiblePayments.isLoading ? "Loading eligibility…" : `Eligible certificate payments awaiting authorized issuance: ${String(eligiblePayments.data ?? 0n)}.`}</CardDescription></Card></Section></>;
}
