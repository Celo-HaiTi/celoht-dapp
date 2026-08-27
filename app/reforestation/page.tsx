"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert, ExternalLink, Leaf, MapPin, ShieldCheck, Sprout, WalletCards } from "lucide-react";
import { useChainId, useReadContract } from "wagmi";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { getProjectId, projects } from "@/lib/data/projects";

const project = projects[0];
const projectId = getProjectId(project.id);
const journey = ["Contribute", "Fund", "Plant", "Verify", "Track", "Grow"];

export default function ReforestationPage() {
  const chainId = useChainId();
  const impactDeployed = isContractDeployed(chainId, "ImpactRegistry");
  const donationDeployed = isContractDeployed(chainId, "DonationManager");
  const trees = useReadContract({ address: getContractAddress(chainId, "ImpactRegistry"), abi: abis.ImpactRegistry, functionName: "totalTreesFor", args: [projectId], query: { enabled: impactDeployed } });
  const donated = useReadContract({ address: getContractAddress(chainId, "DonationManager"), abi: abis.DonationManager, functionName: "totalDonatedTo", args: [projectId], query: { enabled: donationDeployed } });
  const celoDonated = useReadContract({ address: getContractAddress(chainId, "DonationManager"), abi: abis.DonationManager, functionName: "totalCeloDonatedTo", args: [projectId], query: { enabled: donationDeployed } });
  const treeCount = typeof trees.data === "bigint" ? Number(trees.data) : undefined;
  const usdmAmount = typeof donated.data === "bigint" ? formatUnits(donated.data) : undefined;
  const celoAmount = typeof celoDonated.data === "bigint" ? formatUnits(celoDonated.data) : undefined;

  return <div className="reforest-shell min-h-[calc(100dvh-64px)] overflow-hidden px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8"><div className="mx-auto max-w-7xl">
    <section className="reforest-hero" aria-labelledby="reforest-heading"><div className="reforest-hero-copy"><p className="section-kicker">CeloHT · Reforest</p><h1 id="reforest-heading" className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl">Restore Haiti. <span className="text-gold-300">One tree at a time.</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-parchment-100/68 sm:text-base">Support registered reforestation work through a contribution that can be reviewed on Celo. Planting totals appear only when verified records are available on-chain.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/donations" className="reforest-primary-cta"><Sprout size={17} aria-hidden="true" /> Plant a tree <ArrowRight size={16} aria-hidden="true" /></Link><a href="#impact" className="reforest-secondary-cta">Track impact <ArrowRight size={16} aria-hidden="true" /></a></div><p className="mt-5 flex items-center gap-2 text-xs text-parchment-100/45"><ShieldCheck size={14} className="text-cyan-300" aria-hidden="true" /> Contributions are confirmed by the blockchain before they are reported.</p></div><div className="reforest-canopy" aria-hidden="true"><div className="canopy-glow" /><div className="canopy-ring canopy-ring-one" /><div className="canopy-ring canopy-ring-two" /><Leaf className="canopy-leaf canopy-leaf-one" size={34} /><Leaf className="canopy-leaf canopy-leaf-two" size={22} /><span className="canopy-location"><MapPin size={14} /> Haiti · {project.region}</span></div></section>

    <section className="journey-strip" aria-label="Reforestation journey">{journey.map((step, index) => <div key={step} className="journey-step"><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < journey.length - 1 && <ArrowRight size={14} className="journey-arrow" aria-hidden="true" />}</div>)}</section>

    <section className="reforest-workspace mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" id="impact" aria-labelledby="impact-heading"><div><div className="flex items-start justify-between gap-4"><div><p className="section-kicker">Verified impact</p><h2 id="impact-heading" className="mt-1 font-display text-2xl font-semibold text-white">What the chain can confirm</h2></div><ShieldCheck className="text-cyan-300" size={23} aria-hidden="true" /></div><p className="mt-3 max-w-xl text-sm leading-6 text-parchment-100/58">This project is connected to two separate trust boundaries: donations fund the project, while authorized verifiers record planting evidence.</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><Metric label="Verified trees" value={impactDeployed && treeCount !== undefined ? treeCount.toLocaleString() : "Unavailable"} detail={impactDeployed ? "ImpactRegistry" : "Registry not deployed"} /><Metric label="USDm contributed" value={donationDeployed && usdmAmount !== undefined ? usdmAmount : "Unavailable"} detail={donationDeployed ? "DonationManager" : "Contract not deployed"} /><Metric label="CELO contributed" value={donationDeployed && celoAmount !== undefined ? celoAmount : "Unavailable"} detail={donationDeployed ? "DonationManager" : "Contract not deployed"} /></div><div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-parchment-100/48"><CircleAlert size={15} className="mt-0.5 shrink-0 text-gold-300" aria-hidden="true" /><span>{!impactDeployed || !donationDeployed ? "Live contract data is not configured on this network yet. No impact number is being estimated." : "Totals are read from the configured contracts and may take a moment to update after confirmation."}</span></div></div><div className="project-focus"><div className="flex items-start justify-between gap-3"><div><p className="section-kicker">Planting area</p><h2 className="mt-1 font-display text-xl font-semibold text-white">{project.name}</h2></div><span className="project-status">{project.status}</span></div><p className="mt-2 flex items-center gap-2 text-xs text-parchment-100/48"><MapPin size={14} aria-hidden="true" /> {project.region}</p><p className="mt-5 text-sm leading-6 text-parchment-100/62">{project.summary}</p><div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-parchment-100/42">Contribution model</p><p className="mt-2 text-sm leading-6 text-parchment-100/58">Tree economics are shown only when an approved project configuration provides them. The current project has no configured tree-cost ratio.</p></div><Link href="/reforestation/projects" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">View project records <ArrowRight size={15} aria-hidden="true" /></Link></div></section>

    <section className="reforest-next mt-5" aria-labelledby="next-heading"><div><p className="section-kicker">Ready when you are</p><h2 id="next-heading" className="mt-1 font-display text-xl font-semibold text-white">Make a traceable contribution</h2><p className="mt-2 text-sm text-parchment-100/58">The contribution screen validates your network, balance, allowance, and confirmation state before reporting success.</p></div><div className="flex flex-wrap gap-2"><Link href="/donations" className="reforest-primary-cta"><WalletCards size={16} aria-hidden="true" /> Open contribution</Link><Link href="/wallet/activity" className="reforest-secondary-cta"><ExternalLink size={15} aria-hidden="true" /> Activity</Link></div></section>
  </div></div>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="impact-metric"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-parchment-100/42">{label}</p><p className="mt-2 font-display text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-[11px] text-parchment-100/42">{detail}</p></div>;
}

function formatUnits(value: bigint) {
  const whole = value / 1000000000000000000n;
  const fraction = (value % 1000000000000000000n).toString().padStart(18, "0").slice(0, 2);
  return `${whole.toString()}.${fraction}`;
}
