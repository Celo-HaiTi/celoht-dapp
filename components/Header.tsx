"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { primaryNav } from "@/lib/nav";
import { ConnectWalletButton } from "@/ConnectWalletButton";

const visiblePaths = ["/", "/wallet", "/learn", "/impact", "/agents"];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected, chain } = useAccount();
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/celoht-logo.png`;
  const networkReady = chain?.id === celo.id || chain?.id === celoSepolia.id;
  const visibleNav = primaryNav.filter((item) => visiblePaths.includes(item.href));
  const menuNav = primaryNav.filter((item) => !visiblePaths.includes(item.href));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-lg text-white" aria-label="CeloHT home">
          <Image src={logoSrc} alt="CeloHT" width={32} height={32} priority />
          <span className="hidden sm:block"><span className="block font-display text-lg font-semibold tracking-tight">CeloHT</span><span className="block text-[9px] uppercase tracking-[0.18em] text-parchment-100/40">Human finance, on-chain</span></span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {visibleNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-gold-500/15 font-semibold text-gold-300" : "text-parchment-100/65 hover:bg-white/5 hover:text-white"}`}>{item.label}</Link></li>;
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className={`hidden items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-medium md:inline-flex ${networkReady ? "border-emerald-400/20 text-emerald-200" : "border-white/10 text-parchment-100/55"}`}><span className={`h-1.5 w-1.5 rounded-full ${networkReady ? "bg-emerald-400" : "bg-amber-400"}`} />{isConnected && networkReady ? chain?.name : "Celo Network"}</span>
          <div className="sm:hidden"><ConnectWalletButton /></div>
          <div className="hidden sm:block"><ConnectWalletButton /></div>
          <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}</button>
        </div>
      </div>

      {menuOpen && <nav id="mobile-menu" aria-label="Menu" className="border-t border-white/10 bg-navy-950 px-4 pb-4 lg:hidden"><div className="pt-3 sm:hidden"><ConnectWalletButton /></div><ul className="mt-3 space-y-1">{visibleNav.concat(menuNav).map((item) => { const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`); return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)} className={`block rounded-lg px-3 py-3 text-sm ${active ? "bg-gold-500/15 text-gold-300" : "text-parchment-100/70 hover:bg-white/5 hover:text-white"}`}>{item.label}</Link></li>; })}</ul></nav>}
    </header>
  );
}
