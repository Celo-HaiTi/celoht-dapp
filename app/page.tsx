"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Leaf,
  MapPin,
  Send,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { HeroBackground } from "@/components/home/HeroBackground";
import { PrimaryCTA, SecondaryCTA } from "@/components/home/HomeCTA";
import { courses } from "@/lib/data/courses";
import { getUsdmAddress } from "@/lib/contracts";
import { formatTokenAmount, shortenAddress } from "@/lib/utils";

const modules = [
  { label: "Learn", eyebrow: "Education", description: "Build practical confidence with short, focused lessons.", href: "/learn", icon: GraduationCap, action: "Continue learning", tone: "gold" },
  { label: "Finance", eyebrow: "Wallet", description: "Connect a wallet to send, receive, and view live assets.", href: "/wallet", icon: WalletCards, action: "Open finance", tone: "cyan" },
  { label: "Agents", eyebrow: "Community", description: "Find local support or review the path to become an agent.", href: "/agents", icon: Users, action: "Find an agent", tone: "green" },
  { label: "Reforest", eyebrow: "Impact", description: "Explore projects and support registered work when available.", href: "/reforestation", icon: Leaf, action: "Explore projects", tone: "green" },
] as const;

const progressCache = new Map<string, { raw: string; value: string[] }>();

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const completedCourses = useSyncExternalStore(subscribeProgress, () => readProgress(address), () => []);
  const chainId = useChainId();
  const celoBalance = useBalance({ address, query: { enabled: Boolean(address) } });
  const usdmAddress = getUsdmAddress(chainId);
  const usdmBalance = useBalance({ address, token: usdmAddress, query: { enabled: Boolean(address && usdmAddress) } });
  const celoAmount = celoBalance.data ? formatTokenAmount(celoBalance.data.value, celoBalance.data.decimals) : "—";
  const usdmAmount = usdmBalance.data ? formatTokenAmount(usdmBalance.data.value, usdmBalance.data.decimals) : "—";

  return (
    <div className="workspace-bg min-h-[calc(100dvh-64px)] overflow-hidden px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <section className="cinematic-hero" aria-labelledby="hero-heading">
          <HeroBackground />
          <div className="hero-copy">
            <p className="section-kicker">CeloHT · Celo ecosystem</p>
            <h1 id="hero-heading" className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">Build. Learn. Connect. Impact.</h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-parchment-100/68 sm:text-base">A community-powered digital ecosystem connecting financial access, education, local services, and environmental impact.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3"><PrimaryCTA /><SecondaryCTA />{!isConnected && <ConnectWalletButton />}</div>
            <div className="mt-6 flex items-center gap-2 text-xs text-parchment-100/42"><span className={`status-dot ${isConnected ? "status-dot-live" : ""}`} />{isConnected && address ? `Connected · ${shortenAddress(address)}` : "Connect a wallet to unlock live finance actions"}</div>
          </div>
        </section>

        <header id="workspace" className="workspace-intro mt-2 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 pt-5 sm:flex-row sm:items-end">
          <div><p className="section-kicker">Application workspace</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">Overview</h2><p className="mt-2 max-w-xl text-sm leading-6 text-parchment-100/62">Your operational starting point across the CeloHT ecosystem.</p></div>
          <div className="hidden text-right sm:block"><p className="text-xs text-parchment-100/42">{isConnected ? "Connected wallet" : "Workspace status"}</p><p className="mt-1 font-mono text-xs text-parchment-100/72">{isConnected && address ? shortenAddress(address) : "Wallet not connected"}</p></div>
        </header>

        <section className="mt-7" aria-labelledby="actions-heading">
          <div className="flex items-end justify-between gap-4"><div><p className="section-kicker">Your next move</p><h2 id="actions-heading" className="mt-1 font-display text-xl font-semibold text-white">Explore CeloHT</h2></div><span className="hidden text-xs text-parchment-100/40 sm:block">Four connected areas</span></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map(({ label, eyebrow, description, href, icon: Icon, action, tone }, index) => (
              <Link key={href} href={href} className={`module-card module-card-${tone} reveal-delay-${index} group`}>
                <div className="flex items-start justify-between"><span className="module-icon"><Icon size={21} aria-hidden="true" /></span><ArrowUpRight size={17} className="text-parchment-100/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></div>
                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment-100/42">{eyebrow}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-white">{label}</h3>
                <p className="mt-2 min-h-12 text-sm leading-5 text-parchment-100/60">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gold-300">{action}<ArrowUpRight size={14} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="workspace-panel" aria-labelledby="finance-heading">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="section-kicker">Finance</p><h2 id="finance-heading" className="mt-1 font-display text-xl font-semibold text-white">Wallet snapshot</h2><p className="mt-1 text-sm text-parchment-100/52">{isConnected ? "Live balances from your connected wallet." : "Connect a wallet to access live financial actions."}</p></div><WalletCards className="text-gold-300" size={22} aria-hidden="true" /></div>
            {!isConnected ? <div className="mt-7 flex flex-col items-start gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-cyan-300" size={18} aria-hidden="true" /><p className="max-w-md text-sm leading-6 text-parchment-100/62">Your wallet stays in your control. CeloHT never asks for private keys or recovery phrases.</p></div><ConnectWalletButton /></div> : <><div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-5"><BalanceItem label="CELO" value={celoBalance.isLoading ? "Loading" : celoBalance.error ? "Unavailable" : celoAmount} /><BalanceItem label="USDm" value={usdmBalance.isLoading ? "Loading" : usdmBalance.error ? "Unavailable" : usdmAmount} /></div>{celoBalance.error && <p className="mt-4 text-xs text-amber-200" role="alert">CELO balance could not be loaded. Check your RPC connection and retry.</p>}<div className="mt-6 flex flex-wrap gap-2"><ActionButton href="/wallet/send" icon={<Send size={15} />} label="Send" /><ActionButton href="/wallet/receive" icon={<ArrowDownLeft size={15} />} label="Receive" /><Link href="/wallet/activity" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/12 px-4 py-2 text-sm font-semibold text-parchment-100/75 transition hover:border-gold-300/50 hover:text-white"><Activity size={15} aria-hidden="true" /> Activity</Link></div></>}
          </section>

          <section className="workspace-panel" aria-labelledby="progress-heading"><div className="flex items-start justify-between gap-3"><div><p className="section-kicker">Learn</p><h2 id="progress-heading" className="mt-1 font-display text-xl font-semibold text-white">Keep moving</h2></div><BookOpen className="text-gold-300" size={22} aria-hidden="true" /></div><p className="mt-4 text-sm leading-6 text-parchment-100/60">{courses.length} practical courses are available in the CeloHT Academy.</p><div className="mt-6 border-t border-white/10 pt-5"><div className="flex items-center justify-between gap-4"><span className="text-xs text-parchment-100/48">Local progress</span><span className="font-mono text-xs text-parchment-100/65">{completedCourses.length} / {courses.length} complete</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold-500 transition-[width]" style={{ width: `${courses.length ? completedCourses.filter((courseId) => courses.some((course) => course.id === courseId)).length / courses.length * 100 : 0}%` }} /></div><Link href="/learn" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">Open Learn <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section>
        </div>

        <section className="workspace-panel mt-5" aria-labelledby="activity-heading"><div className="flex items-start justify-between gap-4"><div><p className="section-kicker">Activity</p><h2 id="activity-heading" className="mt-1 font-display text-xl font-semibold text-white">Your recent activity</h2></div><Link href="/wallet/activity" className="text-xs font-semibold text-gold-300">View all</Link></div><div className="mt-5 flex flex-col items-start gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-parchment-100/45"><Activity size={18} aria-hidden="true" /></div><div><p className="text-sm font-medium text-parchment-100/75">No activity to show yet</p><p className="mt-1 text-xs leading-5 text-parchment-100/45">Completed lessons and confirmed wallet events will appear here when they exist.</p></div></div></section>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-parchment-100/40"><span className="inline-flex items-center gap-2"><MapPin size={14} aria-hidden="true" /> Community-first infrastructure</span><Link href="/trust" className="inline-flex items-center gap-2 transition hover:text-gold-300"><ShieldCheck size={14} aria-hidden="true" /> Trust Center</Link></div>
      </div>
    </div>
  );
}

function BalanceItem({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-black/10 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment-100/42">{label}</p><p className="mt-2 font-mono text-xl text-white">{value}</p></div>;
}

function ActionButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-300"><span aria-hidden="true">{icon}</span>{label}</Link>;
}

function progressKey(address?: string) {
  return `celoht-academy-progress:${address?.toLowerCase() ?? "guest"}`;
}

function readProgress(address?: string): string[] {
  const key = progressKey(address);
  const raw = localStorage.getItem(key) ?? "[]";
  const cached = progressCache.get(key);
  if (cached?.raw === raw) return cached.value;
  try {
    const value: unknown = JSON.parse(raw);
    const result = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
    progressCache.set(key, { raw, value: result });
    return result;
  } catch {
    progressCache.set(key, { raw, value: [] });
    return progressCache.get(key)?.value ?? [];
  }
}

function subscribeProgress(onChange: () => void) {
  const notify = () => {
    progressCache.clear();
    onChange();
  };
  window.addEventListener("storage", notify);
  window.addEventListener("celoht-progress", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("celoht-progress", notify);
  };
}
