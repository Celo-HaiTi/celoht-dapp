"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert, ExternalLink, Leaf, MapPin, ShieldCheck, Sprout, WalletCards } from "lucide-react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { abis, getContractAddress, getUsdmAddress, isContractDeployed } from "@/lib/contracts";
import { projects } from "@/lib/data/projects";

const project = projects[0];
const journey = ["Contribute", "Fund", "Plant", "Verify", "Track", "Grow"];

export default function ReforestationPage() {
  const reforestationAddress = getContractAddress(celoSepolia.id, "CeloHTReforestation");
  const configured = isContractDeployed(celoSepolia.id, "CeloHTReforestation") && Boolean(getUsdmAddress(celoSepolia.id));
  const totalDonated = useReadContract({ address: reforestationAddress, abi: abis.CeloHTReforestation, functionName: "totalDonated", chainId: celoSepolia.id, query: { enabled: configured } });
  const donationCount = useReadContract({ address: reforestationAddress, abi: abis.CeloHTReforestation, functionName: "donationCount", chainId: celoSepolia.id, query: { enabled: configured } });
  const total = typeof totalDonated.data === "bigint" ? formatUnits(totalDonated.data, 18) : "Unavailable";
  const count = typeof donationCount.data === "bigint" ? donationCount.data.toString() : "Unavailable";

  return <div className="reforest-shell min-h-[calc(100dvh-64px)] overflow-hidden px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8"><div className="mx-auto max-w-7xl">
    <section className="reforest-hero" aria-labelledby="reforest-heading"><div className="reforest-hero-copy"><p className="section-kicker">CeloHT · Reforest</p><h1 id="reforest-heading" className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl">Restore Haiti. <span className="text-gold-300">Support verified work.</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-parchment-100/68 sm:text-base">Support reforestation contributions recorded by CeloHTReforestation. Financial records and physical planting evidence are separate trust boundaries.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/donations" className="reforest-primary-cta"><Sprout size={17} aria-hidden="true" /> Contribute <ArrowRight size={16} aria-hidden="true" /></Link><a href="#impact" className="reforest-secondary-cta">Review records <ArrowRight size={16} aria-hidden="true" /></a></div><p className="mt-5 flex items-center gap-2 text-xs text-parchment-100/45"><ShieldCheck size={14} className="text-cyan-300" aria-hidden="true" /> Contributions are reported only after blockchain confirmation.</p></div><div className="reforest-canopy" aria-hidden="true"><div className="canopy-glow" /><div className="canopy-ring canopy-ring-one" /><div className="canopy-ring canopy-ring-two" /><Leaf className="canopy-leaf canopy-leaf-one" size={34} /><Leaf className="canopy-leaf canopy-leaf-two" size={22} /><span className="canopy-location"><MapPin size={14} /> Haiti · {project.region}</span></div></section>

    <section className="journey-strip" aria-label="Reforestation journey">{journey.map((step, index) => <div key={step} className="journey-step"><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < journey.length - 1 && <ArrowRight size={14} className="journey-arrow" aria-hidden="true" />}</div>)}</section>

    <section className="reforest-workspace mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" id="impact" aria-labelledby="impact-heading"><div><div className="flex items-start justify-between gap-4"><div><p className="section-kicker">Blockchain record</p><h2 id="impact-heading" className="mt-1 font-display text-2xl font-semibold text-white">What the contract can confirm</h2></div><ShieldCheck className="text-cyan-300" size={23} aria-hidden="true" /></div><p className="mt-3 max-w-xl text-sm leading-6 text-parchment-100/58">CeloHTReforestation records USDm donations sent to its configured treasury. It does not record tree counts or prove physical planting by itself.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><Metric label="USDm contributed" value={configured ? total : "Unavailable"} detail={configured ? "CeloHTReforestation · 18 decimals" : "Contract or token not configured"} /><Metric label="Recorded donations" value={configured ? count : "Unavailable"} detail={configured ? "On-chain donation count" : "Contract or token not configured"} /></div><div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-parchment-100/48"><CircleAlert size={15} className="mt-0.5 shrink-0 text-gold-300" aria-hidden="true" /><span>{configured ? "Totals are read from the official contract and may take a moment to update after confirmation." : "Live contract data is unavailable on this network. No impact number is estimated."}</span></div></div><div className="project-focus"><div className="flex items-start justify-between gap-3"><div><p className="section-kicker">Project context</p><h2 className="mt-1 font-display text-xl font-semibold text-white">{project.name}</h2></div><span className="rounded-full border border-cyan-300/25 px-3 py-1 text-xs text-cyan-200">Informational</span></div><p className="mt-4 text-sm leading-6 text-parchment-100/60">{project.summary}</p><p className="mt-5 text-xs leading-5 text-parchment-100/45">Planting evidence, photos, reports, and verifier status require a separate indexed evidence system. They are not inferred from USDm transfers.</p></div></section>

    <section className="reforest-next mt-5" aria-labelledby="next-heading"><div><p className="section-kicker">Ready when you are</p><h2 id="next-heading" className="mt-1 font-display text-xl font-semibold text-white">Make a traceable contribution</h2><p className="mt-2 text-sm text-parchment-100/58">The contribution screen validates your network, balance, allowance, and confirmation state before reporting success.</p></div><div className="flex flex-wrap gap-2"><Link href="/donations" className="reforest-primary-cta"><WalletCards size={16} aria-hidden="true" /> Open contribution</Link><Link href="/wallet/activity" className="reforest-secondary-cta"><ExternalLink size={15} aria-hidden="true" /> Activity</Link></div></section>
  </div></div>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="impact-metric"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-parchment-100/42">{label}</p><p className="mt-2 font-display text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-[11px] text-parchment-100/42">{detail}</p></div>;
}
