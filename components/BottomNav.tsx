"use client";

import Link from "next/link";
import { BookOpen, MoreHorizontal, Network, Users, WalletCards } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { label: "Overview", href: "/", icon: Network },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Finance", href: "/wallet", icon: WalletCards },
  { label: "Agents", href: "/agents", icon: Users },
  { label: "More", href: "/trust", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return <li key={href}><Link href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-colors ${active ? "text-gold-300" : "text-parchment-100/50 hover:text-white"}`}><Icon size={18} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" /><span>{label}</span></Link></li>;
        })}
      </ul>
    </nav>
  );
}