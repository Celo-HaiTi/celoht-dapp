"use client";

import { useAccount, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { getAcademyState } from "@/lib/academy/state";
import { useWalletChainId } from "@/lib/web3/useWalletChainId";

export default function CertificatesPage() {
  const { address, isConnected } = useAccount();
  const studentId = (address ?? "guest").toLowerCase();
  const state = getAcademyState(undefined, studentId);
  const chainId = useWalletChainId();
  const deployed = isContractDeployed(chainId, "CeloHTEducation");
  const educationAddress = getContractAddress(chainId, "CeloHTEducation");
  const eligiblePayments = useReadContract({ address: educationAddress, abi: abis.CeloHTEducation, functionName: "eligiblePayments", args: address ? [address] : undefined, query: { enabled: Boolean(address && deployed) } });

  return (
    <>
      <Breadcrumbs items={[{ label: "Certificates" }]} />
      <PageHero
        eyebrow="Education · Certificates"
        title="Your learning record"
        lead="Learning progress is stored in the academy state and your issued course records are displayed here. Official on-chain issuance remains separate and contract-gated."
      />
      <Section>
        <Card className="max-w-2xl">
          <CardTitle>{!isConnected ? "Learning record" : "Certificate record"}</CardTitle>
          <CardDescription className="mt-3">
            {state.certificateRecords.length === 0 ? "No certificates have been issued yet. Complete a course to create a certificate record." : `Issued certificates: ${state.certificateRecords.length}.`}
          </CardDescription>
          {state.certificateRecords.length > 0 && (
            <div className="mt-5 space-y-3">
              {state.certificateRecords.map((record) => (
                <div key={record.id} className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <strong className="text-white">{record.title}</strong>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold-300">Issued</span>
                  </div>
                  <p className="mt-2 text-sm text-parchment-100/60">
                    {new Date(record.issuedAt).toLocaleDateString()} · {record.studentId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Section>
      {deployed && address ? (
        <Section>
          <Card className="max-w-xl">
            <CardTitle>On-chain eligibility</CardTitle>
            <CardDescription className="mt-2">
              {eligiblePayments.isLoading ? "Loading eligibility…" : `Eligible certificate payments awaiting authorized issuance: ${String(eligiblePayments.data ?? 0n)}.`}
            </CardDescription>
          </Card>
        </Section>
      ) : null}
    </>
  );
}
