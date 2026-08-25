import Link from "next/link";
import { footerNav } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="border-navy-700/10 bg-navy-950 text-parchment-100 dark:border-parchment-100/10 mt-24 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end"><div><p className="font-display text-xl font-semibold text-white">CeloHT</p><p className="mt-1 text-sm text-parchment-100/55">Digital Finance for Everyone</p></div><Link href="/community" className="text-sm font-semibold text-gold-300 hover:text-gold-200">Join the community</Link></div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerNav.map((group) => (
            <div key={group.heading}>
              <h2 className="font-display text-gold-300 text-lg font-semibold">{group.heading}</h2>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-parchment-100/70 hover:text-parchment-100 text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-parchment-100/10 mt-10 border-t pt-6">
          <p className="text-parchment-100/50 max-w-3xl text-xs">
            CeloHT is a community-driven, open-source initiative built on the Celo ecosystem. It is
            not a cryptocurrency, an ICO, or an investment platform. CeloHT never holds your keys.
          </p>
          <p className="text-parchment-100/40 mt-4 text-xs">
            © {new Date().getFullYear()} CeloHT Contributors. Code licensed under Apache 2.0.
          </p>
        </div>
      </div>
    </footer>
  );
}
