"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Copy, ExternalLink, Network, Send, ShieldCheck, WalletCards, Users, Sprout, ArrowDownLeft, GraduationCap } from "lucide-react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { getUsdmAddress } from "@/lib/contracts";
import { formatTokenAmount } from "@/lib/utils";
import { courses } from "@/lib/data/courses";

function StatusDot({ tone = "muted" }: { tone?: "good" | "muted" | "warn" }) {
  return <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${tone === "good" ? "bg-emerald-500" : tone === "warn" ? "bg-amber-500" : "bg-slate-400"}`} />;
}

export default function HomePage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const celoBalance = useBalance({ address, query: { enabled: Boolean(address) } });
  const usdmAddress = getUsdmAddress(chainId);
  const usdmBalance = useBalance({ address, token: usdmAddress, query: { enabled: Boolean(address && usdmAddress) } });
  const networkReady = chain?.id === 42220 || chain?.id === 11142220;
  const celoAmount = celoBalance.data ? formatTokenAmount(celoBalance.data.value, celoBalance.data.decimals) : "—";
  const usdmAmount = usdmBalance.data ? formatTokenAmount(usdmBalance.data.value, usdmBalance.data.decimals) : "—";
  const networkLabel = !isConnected ? "Network available" : networkReady ? "Celo Mainnet" : "Wrong network";

  return (
    <div className="app-shell dashboard-grid min-h-[calc(100vh-65px)] px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:py-12 lg:pb-16">
      <div className="mx-auto max-w-7xl">
      <div className="dashboard-reveal mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Human finance, on-chain</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">Your financial and community journey starts here.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-parchment-100/65">One clear place to manage value, learn with confidence, and support the people and places that matter.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3"><span className="hidden text-xs text-parchment-100/45 sm:block">Celo Mainnet</span><ConnectWalletButton /></div>
      </div>

      <div className="dashboard-reveal dashboard-reveal-delay grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-[#123b38] p-6 text-white shadow-2xl shadow-black/20 sm:p-8" aria-labelledby="balance-heading">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-white/60">Total balance <span className="ml-2 rounded-full bg-gold-300/15 px-2 py-1 text-[10px] text-gold-200">ON-CHAIN</span></p><h2 id="balance-heading" className="mt-3 font-display text-4xl font-semibold tracking-tight">{!isConnected ? "$0.00" : celoBalance.isLoading || usdmBalance.isLoading ? "Loading balance" : celoBalance.error && usdmBalance.error ? "Balance error" : "$0.00"}</h2></div><div className="rounded-xl border border-white/10 bg-white/5 p-3"><WalletCards size={22} className="text-gold-300" aria-hidden="true" /></div></div>
          {!isConnected && <p className="mt-3 text-sm text-white/60">Connect your wallet to view live assets.</p>}
          {isConnected && celoBalance.error && <p role="alert" className="mt-3 text-sm text-amber-200">CELO balance could not be loaded. Check your RPC connection and retry.</p>}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5"><div><p className="text-xs text-white/50">CELO</p><p className="mt-1 font-mono text-lg">{!isConnected ? "—" : celoBalance.isLoading ? "..." : celoBalance.error ? "Error" : celoAmount}</p></div><div><p className="text-xs text-white/50">USDm</p><p className="mt-1 font-mono text-lg">{!isConnected ? "—" : usdmBalance.isLoading ? "..." : usdmBalance.error ? "Error" : usdmAmount}</p></div></div>
          <div className="mt-6 flex flex-wrap gap-2"><ActionButton href="/wallet/send" icon={<Send size={15} />} label="Send" /><ActionButton href="/wallet/receive" icon={<ArrowDownLeft size={15} />} label="Receive" /></div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6" aria-labelledby="network-heading"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-parchment-100/55">Network</p><StatusDot tone={isConnected && networkReady ? "good" : isConnected ? "warn" : "muted"} /></div><div className="mt-4 flex items-start justify-between gap-4"><div><h2 id="network-heading" className="font-display text-xl font-semibold text-white">{networkLabel}</h2><p className="mt-2 text-sm text-parchment-100/65">{!isConnected ? "Connect a wallet to start using CeloHT." : networkReady ? "Connected and ready for wallet actions." : "Switch your wallet to Celo Mainnet."}</p></div><Network size={20} className="text-gold-300" aria-hidden="true" /></div><dl className="mt-6 grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg border border-white/10 bg-black/10 p-3"><dt className="text-parchment-100/45">Chain ID</dt><dd className="mt-1 font-mono text-white">{isConnected ? chainId : "42220"}</dd></div><div className="rounded-lg border border-white/10 bg-black/10 p-3"><dt className="text-parchment-100/45">Gas token</dt><dd className="mt-1 font-mono text-white">CELO</dd></div></dl></section>
      </div>

      <section className="dashboard-reveal dashboard-reveal-delay-2 mt-8" aria-labelledby="quick-actions-heading"><div className="mb-3 flex items-center justify-between"><h2 id="quick-actions-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-parchment-100/55">Quick actions</h2><span className="text-xs text-parchment-100/40">Move with purpose</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-5"><Action href="/wallet/send" icon={<Send />} label="Send" /><Action href="/wallet/receive" icon={<Copy />} label="Receive" /><Action href="/learn" icon={<GraduationCap />} label="Learn" /><Action href="/agents" icon={<Users />} label="Agents" /><Action href="/impact" icon={<Sprout />} label="Impact" /></div></section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><div className="flex items-center gap-3"><ShieldCheck className="text-cyan-300" size={20} aria-hidden="true" /><h2 className="font-display font-semibold text-white">Recent activity</h2></div><p className="mt-4 text-sm leading-6 text-parchment-100/65">{isConnected ? "CeloHT-specific activity will appear here when the indexer is connected. Your full wallet history is available on CeloScan." : "Connect your wallet to view activity. CeloHT never invents transaction history."}</p><Link href="/wallet/activity" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-300">Open activity <ExternalLink size={14} aria-hidden="true" /></Link></section><section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-parchment-100/55">Learn and participate</p><div className="mt-5 grid grid-cols-2 gap-4"><MiniMetric icon={<BookOpen />} value={`${courses.length + 2}`} label="Academy courses" /><MiniMetric icon={<Sprout />} value="—" label="Verified trees" /></div><p className="mt-5 text-xs text-parchment-100/40">Learning is available now. Verified impact totals appear after the registry and indexer are connected.</p></section></div>
      </div>
    </div>
  );
}

function Action({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 text-white transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-white/10"><span className="text-gold-300">{icon}</span><span className="mt-6 block text-sm font-semibold">{label}</span><ArrowUpRight className="mt-1 text-parchment-100/50" size={15} aria-hidden="true" /></Link>;
}

function ActionButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-300"><span aria-hidden="true">{icon}</span>{label}</Link>;
}

function MiniMetric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="rounded-xl border border-white/10 bg-black/10 p-4"><span className="text-forest-400">{icon}</span><p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-parchment-100/50">{label}</p></div>;
}
