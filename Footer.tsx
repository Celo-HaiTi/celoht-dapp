import Link from "next/link";
import { footerNav } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="border-navy-700/10 bg-navy-950 text-parchment-100 dark:border-parchment-100/10 mt-24 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
          <p className="text-parchment-100/50 max-w-2xl text-xs">
            CeloHT is a community-driven, open-source initiative built on the Celo ecosystem. It is
            not a cryptocurrency, an ICO, an NFT project, or an investment platform, and it does not
            issue a token. CELO and cUSD are used as network and payment infrastructure; Valora is
            supported as a compatible wallet — CeloHT does not own or operate Valora.
          </p>
          <p className="text-parchment-100/40 mt-4 text-xs">
            © {new Date().getFullYear()} CeloHT Contributors. Code licensed under Apache 2.0.
          </p>
        </div>
      </div>
    </footer>
  );
}
