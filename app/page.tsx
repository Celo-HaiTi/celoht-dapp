"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Copy, ExternalLink, Leaf, Network, Send, ShieldCheck, WalletCards } from "lucide-react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { getUsdmAddress } from "@/lib/contracts";
import { formatTokenAmount, shortenAddress } from "@/lib/utils";

function StatusDot({ tone = "muted" }: { tone?: "good" | "muted" | "warn" }) {
  return <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${tone === "good" ? "bg-emerald-500" : tone === "warn" ? "bg-amber-500" : "bg-slate-400"}`} />;
}

export default function HomePage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const celoBalance = useBalance({ address, query: { enabled: Boolean(address) } });
  const usdmAddress = getUsdmAddress(chainId);
  const usdmBalance = useBalance({ address, token: usdmAddress, query: { enabled: Boolean(address && usdmAddress) } });
  const networkReady = chain?.id === 42220 || chain?.id === 44787;
  const celoAmount = celoBalance.data ? formatTokenAmount(celoBalance.data.value, celoBalance.data.decimals) : "Unavailable";
  const usdmAmount = usdmBalance.data ? formatTokenAmount(usdmBalance.data.value, usdmBalance.data.decimals) : "Unavailable";

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 pb-28 sm:px-6 lg:px-8 lg:py-10 lg:pb-12">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-800">CeloHT workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">Your gateway to Celo, financial inclusion and real-world impact.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">Send and receive digital assets, learn Web3, and connect with the CeloHT ecosystem.</p>
        </div>
        <ConnectWalletButton />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
        <section className="overflow-hidden rounded-2xl bg-navy-950 p-6 text-white shadow-[0_20px_55px_rgba(11,17,32,0.16)] sm:p-8" aria-labelledby="balance-heading">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-white/60">Total Balance</p><h2 id="balance-heading" className="mt-3 text-4xl font-semibold tracking-tight">{!isConnected ? "Connect wallet" : celoBalance.isLoading ? "Loading..." : celoBalance.error ? "Unavailable" : `${celoAmount} CELO`}</h2></div><div className="rounded-xl border border-white/10 bg-white/5 p-3"><WalletCards size={22} className="text-gold-300" aria-hidden="true" /></div></div>
          {isConnected && celoBalance.error && <p role="alert" className="mt-3 text-sm text-amber-200">We could not load your CELO balance. Check your RPC connection and retry.</p>}
          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/10 pt-5"><div><p className="text-xs text-white/50">CELO</p><p className="mt-1 font-mono text-lg">{!isConnected ? "Not connected" : celoBalance.isLoading ? "..." : celoBalance.error ? "Unavailable" : celoAmount}</p></div><div><p className="text-xs text-white/50">USDm</p><p className="mt-1 font-mono text-lg">{!usdmAddress ? "Not configured" : usdmBalance.isLoading ? "..." : usdmBalance.error ? "Unavailable" : usdmAmount}</p></div></div>
        </section>

        <section className="rounded-2xl border border-navy-700/10 bg-white p-6 shadow-sm" aria-labelledby="network-heading"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Network</p><StatusDot tone={isConnected && networkReady ? "good" : isConnected ? "warn" : "muted"} /></div><h2 id="network-heading" className="mt-4 text-xl font-semibold text-navy-950">Celo Network</h2><p className="mt-2 text-sm text-ink-soft">{!isConnected ? "Connect a wallet to check your network." : networkReady ? `${chain?.name ?? "Celo"} connected` : "Please switch to the Celo network."}</p><div className="mt-6 flex items-center gap-2 text-xs text-ink-soft"><Network size={15} aria-hidden="true" /> {isConnected ? `Chain ID ${chainId}` : "Status checking"}</div></section>
      </div>

      <section className="mt-6" aria-labelledby="quick-actions-heading"><h2 id="quick-actions-heading" className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">Quick actions</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Action href="/wallet#send" icon={<Send />} label="Send" /><Action href="/wallet#receive" icon={<Copy />} label="Receive" /><Action href="/education" icon={<BookOpen />} label="Learn Web3" /><Action href="/impact" icon={<Leaf />} label="Your impact" /></div></section>

      <div className="mt-6 grid gap-5 md:grid-cols-2"><section className="rounded-2xl border border-navy-700/10 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><ShieldCheck className="text-forest-500" size={20} aria-hidden="true" /><h2 className="font-semibold">Recent Activity</h2></div><p className="mt-4 text-sm leading-6 text-ink-soft">{isConnected ? "Your confirmed and pending transfers will appear here." : "Connect your wallet to view wallet activity."}</p><Link href="/transactions" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-800">View activity <ExternalLink size={14} aria-hidden="true" /></Link></section><section className="rounded-2xl border border-navy-700/10 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Wallet address</p><p className="mt-4 font-mono text-sm text-navy-950">{address ? shortenAddress(address) : "Not connected"}</p><p className="mt-2 text-sm text-ink-soft">Your address stays in your wallet and is never sent to CeloHT.</p></section></div>
    </div>
  );
}

function Action({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="group rounded-xl border border-navy-700/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500"><span className="text-gold-700">{icon}</span><span className="mt-6 block text-sm font-semibold">{label}</span><ArrowUpRight className="mt-1 text-ink-soft" size={15} aria-hidden="true" /></Link>;
}
