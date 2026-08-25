"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { celo } from "wagmi/chains";
import { primaryNav } from "@/lib/nav";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { LayoutDashboard, WalletCards, ReceiptText, Users, GraduationCap, Sprout, MoreHorizontal, Menu, X, Settings } from "lucide-react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected, chain } = useAccount();
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/celoht-logo.png`;

  const networkStatus = !isConnected
    ? "Demo mode"
    : chain?.id === celo.id
      ? "Connected"
      : "Wrong network";

  const statusStyle =
    networkStatus === "Connected"
      ? "bg-forest-500/15 text-forest-300"
      : networkStatus === "Wrong network"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-white/10 text-parchment-100/70";

  const iconFor = (label: string) => {
    const icons = { Home: LayoutDashboard, Wallet: WalletCards, Transactions: ReceiptText, Education: GraduationCap, Agents: Users, Reforestation: Sprout, Settings };
    const Icon = icons[label as keyof typeof icons] ?? MoreHorizontal;
    return <Icon size={17} aria-hidden="true" />;
  };

  const workspaceNav = primaryNav.filter((item) => ["/", "/wallet", "/education", "/reforestation", "/agents"].includes(item.href));

  return (
    <>
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-white/10 bg-navy-950 px-4 py-5 lg:flex">
      <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2 text-white">
        <Image src={logoSrc} alt="CeloHT" width={30} height={30} priority />
        <span><span className="block font-display text-lg font-semibold tracking-tight">CeloHT</span><span className="block text-[10px] uppercase tracking-[0.16em] text-parchment-100/40">Human finance, on-chain</span></span>
      </Link>
      <p className="mb-2 mt-10 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment-100/35">Navigate</p>
      <nav aria-label="Primary" className="flex-1">
        <ul className="space-y-1">
          {workspaceNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-gold-500/15 text-gold-300" : "text-parchment-100/60 hover:bg-white/5 hover:text-white"}`}>{iconFor(item.label)}<span>{item.label}</span></Link></li>;
          })}
        </ul>
      </nav>
      <div className="border-t border-white/10 pt-4"><Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-parchment-100/60 hover:bg-white/5 hover:text-white"><Settings size={17} aria-hidden="true" /> Settings</Link><div className="mt-3 flex items-center gap-2 px-3 text-xs text-parchment-100/50"><span className={`h-2 w-2 rounded-full ${networkStatus === "Connected" ? "bg-emerald-400" : "bg-amber-400"}`} />{networkStatus === "Connected" ? chain?.name : "Wallet not connected"}</div></div>
    </aside>
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur-xl lg:ml-60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-md lg:hidden">
            <Image src={logoSrc} alt="CeloHT" width={28} height={28} priority />
            <span className="font-display text-lg font-semibold tracking-tight text-white">CeloHT</span>
          </Link>
          <span className={`hidden rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] sm:inline ${statusStyle}`}>
            {networkStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-parchment-100/70 md:inline-flex"><span className={`h-1.5 w-1.5 rounded-full ${networkStatus === "Connected" ? "bg-emerald-400" : "bg-amber-400"}`} /> {networkStatus === "Connected" ? chain?.name : "Celo network"}</span>
          <div className="hidden sm:block"><ConnectWalletButton /></div>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-white/10 px-4 pb-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-parchment-100/70 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
    <nav aria-label="Mobile primary" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {[workspaceNav[0], workspaceNav[1], workspaceNav[2], workspaceNav[3], { label: "Menu", href: "#mobile-nav" }].map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (item.label === "Menu") return <li key={item.href}><button type="button" onClick={() => setMenuOpen(true)} className="flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-lg text-[10px] text-parchment-100/55"><MoreHorizontal size={17} aria-hidden="true" /><span>Menu</span></button></li>;
          return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${active ? "text-gold-300" : "text-parchment-100/55"}`}>{iconFor(item.label)}<span>{item.label === "Education" ? "Learn" : item.label === "Reforestation" ? "Forest" : item.label}</span></Link></li>;
        })}
      </ul>
    </nav>
    </>
  );
}
