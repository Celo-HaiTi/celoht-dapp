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

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected, chain } = useAccount();
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/celoht-logo.png`;
  const networkStatus = !isConnected ? "Disconnected" : chain?.id === celo.id || chain?.id === celoSepolia.id ? "Celo connected" : "Wrong network";
  const statusTone = networkStatus === "Celo connected" ? "text-emerald-700 bg-emerald-500/10" : networkStatus === "Wrong network" ? "text-amber-800 bg-amber-500/10" : "text-ink-soft bg-slate-500/10";

  return <header className="sticky top-0 z-40 border-b border-navy-700/10 bg-parchment/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"><Link href="/" className="flex shrink-0 items-center gap-2 rounded-md"><Image src={logoSrc} alt="CeloHT" width={30} height={30} priority /><span className="font-display text-lg font-semibold tracking-tight text-navy-950">CeloHT</span></Link><nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex"><ul className="flex items-center gap-1">{primaryNav.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`); return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-gold-500/15 font-semibold text-gold-800" : "text-ink-soft hover:bg-navy-700/5 hover:text-navy-950"}`}>{item.label}</Link></li>; })}</ul></nav><div className="flex items-center gap-2"><span className={`hidden rounded-full px-2.5 py-1.5 text-[11px] font-semibold sm:inline-flex ${statusTone}`}>{networkStatus}</span><div className="hidden sm:block"><ConnectWalletButton /></div><button type="button" aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-navy-700/15 lg:hidden"><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button></div></div>{menuOpen && <nav id="mobile-nav" aria-label="Mobile" className="border-t border-navy-700/10 px-4 pb-4 lg:hidden"><ul className="space-y-1 pt-2">{primaryNav.map((item) => <li key={item.href}><Link href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-ink-soft hover:bg-navy-700/5">{item.label}</Link></li>)}<li className="pt-2 sm:hidden"><ConnectWalletButton /></li></ul></nav>}</header>;
}
