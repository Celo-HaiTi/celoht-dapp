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

        <div className="mt-10 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-[#142b3d] via-[#102337] to-[#123b38] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">CeloHT</p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">Digital Finance for Everyone</h2>
              <p className="mt-3 text-sm leading-6 text-parchment-100/65">One trusted place to manage value, learn with confidence, and support the communities and places that matter.</p>
            </div>
            <Link href="/community" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-gold-500 px-5 text-sm font-semibold text-navy-950 transition hover:bg-gold-300">Join the community</Link>
          </div>
          <div className="mt-7 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
            <Link href="/wallet" className="rounded-xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-gold-300/40"><span className="block text-sm font-semibold text-white">Manage value</span><span className="mt-1 block text-xs text-parchment-100/50">Wallet and payments</span></Link>
            <Link href="/learn" className="rounded-xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-gold-300/40"><span className="block text-sm font-semibold text-white">Learn</span><span className="mt-1 block text-xs text-parchment-100/50">Build practical knowledge</span></Link>
            <Link href="/impact" className="rounded-xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-gold-300/40"><span className="block text-sm font-semibold text-white">Create impact</span><span className="mt-1 block text-xs text-parchment-100/50">Support verified action</span></Link>
          </div>
        </div>
        <div className="border-parchment-100/10 mt-6 border-t pt-6">
          <p className="text-parchment-100/45 max-w-3xl text-xs">CeloHT is a community-driven, open-source initiative built on the Celo ecosystem. It is not a cryptocurrency, an ICO, or an investment platform. CeloHT never holds your keys.</p>
          <p className="text-parchment-100/40 mt-4 text-xs">© {new Date().getFullYear()} CeloHT Contributors. Code licensed under Apache 2.0.</p>
        </div>
      </div>
    </footer>
  );
}
