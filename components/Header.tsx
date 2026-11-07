"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, BookOpen, Leaf, Menu, Network, Settings, ShieldCheck, Users, WalletCards, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { BackendAuthButton } from "@/components/BackendAuthButton";
import { useI18n } from "@/lib/i18n/context";
import { NotificationCenter } from "@/components/NotificationCenter";

const workspaceNav = [
  { label: "Overview", href: "/", icon: Network },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Finance", href: "/wallet", icon: WalletCards },
  { label: "Agents", href: "/agents", icon: Users },
  { label: "Governance", href: "/governance", icon: ShieldCheck },
  { label: "Reforest", href: "/reforestation", icon: Leaf },
];
const secondaryNav = [
  { label: "Pilot Workspace", href: "/pilot", icon: ShieldCheck },
  { label: "Activity", href: "/wallet/activity", icon: Activity },
  { label: "Profile", href: "/profile", icon: Settings },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Trust Center", href: "/trust", icon: ShieldCheck },
];
type NavItem = (typeof workspaceNav)[number];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { address, isConnected, chain } = useAccount();
  const { t } = useI18n();
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/celoht-logo.png`;
  const networkReady = chain?.id === celoSepolia.id;
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const labels: Record<string, string> = {
    Overview: t("navigation.overview"), Learn: t("navigation.learn"), Finance: t("navigation.finance"),
    Agents: t("navigation.agents"), Reforest: t("navigation.reforest"), Activity: t("navigation.activity"),
    Profile: t("navigation.profile"), Settings: t("navigation.settings"), "Trust Center": t("navigation.trustCenter"),
  };
  const renderNavItem = ({ label, href, icon: Icon }: NavItem) => <li key={href}><Link href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setMenuOpen(false)} className={`sidebar-nav-link ${isActive(href) ? "sidebar-nav-link-active" : ""}`}><Icon size={17} strokeWidth={isActive(href) ? 2.3 : 1.8} aria-hidden="true" /><span>{labels[label] ?? label}</span></Link></li>;

  return (
    <>
    <aside className="app-sidebar fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/10 bg-navy-950 px-4 py-5 lg:flex">
      <Link href="/" className="brand-mark flex items-center gap-3 px-2" aria-label="CeloHT overview"><Image src={logoSrc} alt="CeloHT" width={36} height={36} priority className="brand-logo" /><span><span className="block font-display text-lg font-semibold tracking-tight text-white">CeloHT</span><span className="block text-[9px] uppercase tracking-[0.16em] text-parchment-100/38">Sovereign finance</span></span></Link>
      <nav aria-label={t("navigation.workspace")} className="app-sidebar-nav flex-1">
        <div className="sidebar-nav-group">
          <p className="sidebar-nav-heading">{t("navigation.workspace")}</p>
          <ul className="space-y-1">{workspaceNav.map(renderNavItem)}</ul>
        </div>
        <div className="sidebar-nav-group">
          <p className="sidebar-nav-heading">{t("navigation.account")}</p>
          <ul className="space-y-1">{secondaryNav.map(renderNavItem)}</ul>
        </div>
      </nav>
      <div className="app-sidebar-footer">
        <span className={`sidebar-network-dot ${isConnected && networkReady ? "sidebar-network-dot-ready" : ""}`} />
        <span className="min-w-0 truncate">{isConnected && networkReady ? chain?.name : t("navigation.walletNotConnected")}</span>
        {isConnected && !networkReady && <span className="sidebar-network-warning">Wrong network</span>}
      </div>
    </aside>
    {menuOpen && <button type="button" className="mobile-menu-backdrop lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
    <header className="app-header sticky top-0 z-40 border-b border-white/10 bg-navy-950/90 backdrop-blur-xl lg:ml-64">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="header-brand flex min-w-0 shrink items-center gap-2.5 rounded-lg text-white" aria-label="CeloHT home">
          <Image src={logoSrc} alt="CeloHT" width={30} height={30} priority className="brand-logo lg:hidden" />
          <span className="header-brand-copy"><span className="block font-display text-lg font-semibold tracking-tight">CeloHT</span><span className="header-brand-tagline block text-[9px] uppercase tracking-[0.18em] text-parchment-100/40">Sovereign finance</span></span>
        </Link>

        <div className="flex items-center gap-2">
          <span className={`hidden items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-medium md:inline-flex ${networkReady ? "border-emerald-400/20 text-emerald-200" : "border-white/10 text-parchment-100/55"}`}><span className={`h-1.5 w-1.5 rounded-full ${networkReady ? "bg-emerald-400" : "bg-amber-400"}`} />{isConnected && networkReady ? chain?.name : t("navigation.celoNetwork")}</span>
          <NotificationCenter walletAddress={address} />
          <div className="shrink-0"><ConnectWalletButton /></div>
          <div className="hidden shrink-0 sm:block"><BackendAuthButton /></div>
          <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}</button>
        </div>
      </div>

      {menuOpen && <nav id="mobile-menu" aria-label={t("navigation.mobile")} className="mobile-menu-panel lg:hidden"><div className="mobile-menu-content"><section className="mobile-menu-group"><p className="sidebar-nav-heading">{t("navigation.workspace")}</p><ul className="space-y-1">{workspaceNav.map(renderNavItem)}</ul></section><section className="mobile-menu-group"><p className="sidebar-nav-heading">{t("navigation.account")}</p><ul className="space-y-1">{secondaryNav.map(renderNavItem)}</ul></section></div></nav>}
    </header>
    </>
  );
}
