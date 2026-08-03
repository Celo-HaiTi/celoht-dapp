"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { primaryNav } from "@/lib/nav";
import { ThemeToggle } from "@/components/ThemeToggle";

const ConnectWalletButton = dynamic(
  () => import("@/components/web3/ConnectWalletButton").then((mod) => mod.ConnectWalletButton),
  {
    ssr: false,
    loading: () => (
      <div className="bg-navy-700/10 dark:bg-parchment-100/10 h-9 w-36 animate-pulse rounded-full" />
    ),
  },
);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-navy-700/10 bg-parchment/90 dark:border-parchment-100/10 dark:bg-navy-950/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-md">
          <Image src="/celoht-logo.png" alt="CeloHT" width={28} height={28} priority />
          <span className="font-display text-lg font-semibold tracking-tight">CeloHT</span>
          <span className="bg-gold-500/15 text-gold-800 dark:text-gold-300 hidden rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase sm:inline">
            dApp
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "text-gold-800 dark:text-gold-300"
                        : "text-ink-soft hover:text-ink dark:text-parchment-100/70 dark:hover:text-parchment-100"
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
          <ThemeToggle />
          <ConnectWalletButton />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="border-navy-700/20 dark:border-parchment-100/20 inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
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
          className="border-navy-700/10 dark:border-parchment-100/10 border-t px-4 pb-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-ink-soft hover:bg-navy-700/5 hover:text-ink dark:text-parchment-100/70 dark:hover:bg-parchment-100/5 dark:hover:text-parchment-100 block rounded-md px-3 py-2 text-sm"
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
