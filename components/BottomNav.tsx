"use client";

import Link from "next/link";
import { BookOpen, Leaf, Users, WalletCards } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

const items = [
  { label: "Wallet", href: "/wallet", icon: WalletCards },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Agent", href: "/agents", icon: Users },
  { label: "Reforest", href: "/reforestation", icon: Leaf },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const labels = { Wallet: t("common.wallet"), Learn: t("common.learn"), Agent: t("common.agents"), Reforest: t("common.reforest") };

  return (
    <nav aria-label={t("navigation.mobile")} className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return <li key={href}><Link href={href} aria-current={active ? "page" : undefined} className={`mobile-nav-item ${label === "Wallet" ? "mobile-nav-primary" : ""} ${active ? "mobile-nav-active" : ""}`}><Icon size={18} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" /><span>{labels[label as keyof typeof labels]}</span></Link></li>;
        })}
      </ul>
    </nav>
  );
}