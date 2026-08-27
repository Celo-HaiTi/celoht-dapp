"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, BookOpen, Leaf, Menu, Network, Settings, ShieldCheck, Users, WalletCards, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { ConnectWalletButton } from "@/ConnectWalletButton";

const workspaceNav = [
  { label: "Overview", href: "/", icon: Network },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Finance", href: "/wallet", icon: WalletCards },
  { label: "Agents", href: "/agents", icon: Users },
  { label: "Reforest", href: "/reforestation", icon: Leaf },
];
const secondaryNav = [
  { label: "Activity", href: "/wallet/activity", icon: Activity },
  { label: "Profile", href: "/profile", icon: Settings },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Trust Center", href: "/trust", icon: ShieldCheck },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected, chain } = useAccount();
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/celoht-logo.png`;
  const networkReady = chain?.id === celo.id || chain?.id === celoSepolia.id;
  const allNav = [...workspaceNav, ...secondaryNav];
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const renderNavItem = ({ label, href, icon: Icon }: (typeof allNav)[number]) => <li key={href}><Link href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive(href) ? "bg-gold-500/12 font-semibold text-gold-300" : "text-parchment-100/58 hover:bg-white/5 hover:text-white"}`}><Icon size={17} strokeWidth={isActive(href) ? 2.3 : 1.8} aria-hidden="true" /><span>{label}</span></Link></li>;

  return (
    <>
    <aside className="app-sidebar fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/10 bg-navy-950 px-4 py-5 lg:flex">
      <Link href="/" className="brand-mark flex items-center gap-3 px-2" aria-label="CeloHT overview"><Image src={logoSrc} alt="CeloHT" width={36} height={36} priority className="brand-logo" /><span><span className="block font-display text-lg font-semibold tracking-tight text-white">CeloHT</span><span className="block text-[9px] uppercase tracking-[0.16em] text-parchment-100/38">Application workspace</span></span></Link>
      <p className="mb-2 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment-100/32">Workspace</p>
      <nav aria-label="Workspace" className="flex-1"><ul className="space-y-1">{workspaceNav.map(renderNavItem)}</ul><p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment-100/32">Account</p><ul className="space-y-1">{secondaryNav.map(renderNavItem)}</ul></nav>
      <div className="border-t border-white/10 pt-4"><div className="flex items-center gap-2 px-3 text-xs text-parchment-100/50"><span className={`h-2 w-2 rounded-full ${isConnected && networkReady ? "bg-emerald-400" : "bg-amber-400"}`} />{isConnected && networkReady ? chain?.name : "Wallet not connected"}</div></div>
    </aside>
    <header className="app-header sticky top-0 z-40 border-b border-white/10 bg-navy-950/90 backdrop-blur-xl lg:ml-64">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-lg text-white" aria-label="CeloHT home">
          <Image src={logoSrc} alt="CeloHT" width={30} height={30} priority className="brand-logo lg:hidden" />
          <span className="hidden sm:block"><span className="block font-display text-lg font-semibold tracking-tight">CeloHT</span><span className="block text-[9px] uppercase tracking-[0.18em] text-parchment-100/40">Human finance, on-chain</span></span>
        </Link>

        <div className="flex items-center gap-2">
          <span className={`hidden items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-medium md:inline-flex ${networkReady ? "border-emerald-400/20 text-emerald-200" : "border-white/10 text-parchment-100/55"}`}><span className={`h-1.5 w-1.5 rounded-full ${networkReady ? "bg-emerald-400" : "bg-amber-400"}`} />{isConnected && networkReady ? chain?.name : "Celo Network"}</span>
          <div className="shrink-0"><ConnectWalletButton /></div>
          <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}</button>
        </div>
      </div>

      {menuOpen && <nav id="mobile-menu" aria-label="Menu" className="border-t border-white/10 bg-navy-950 px-4 pb-4 lg:hidden"><ul className="mt-3 space-y-1">{allNav.map(renderNavItem)}</ul></nav>}
    </header>
    </>
  );
}
