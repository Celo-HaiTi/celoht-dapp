"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { celo } from "wagmi/chains";
import { primaryNav } from "@/lib/nav";
import { Button } from "@/components/ui/Button";

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
      ? "bg-forest-500/15 text-forest-700 dark:text-forest-300"
      : networkStatus === "Wrong network"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
        : "bg-navy-700/10 text-ink-soft dark:bg-parchment-100/10 dark:text-parchment-100/70";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-md">
            <Image src={logoSrc} alt="CeloHT" width={28} height={28} priority />
            <span className="font-display text-lg font-semibold tracking-tight text-white">CeloHT</span>
          </Link>
          <span className={`hidden rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] sm:inline ${statusStyle}`}>
            {networkStatus}
          </span>
        </div>

        <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-gold-500/15 text-gold-300"
                        : "text-parchment-100/65 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-parchment-100/70 md:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Celo Mainnet</span>
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/wallet">Open wallet</Link></Button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              {menuOpen ? (
                <path
                  fill="currentColor"
                  d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z"
                />
              ) : (
                <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              )}
            </svg>
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
  );
}
