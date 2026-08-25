import Link from "next/link";

export default function TermsPage() {
  return <div className="mx-auto max-w-3xl px-4 py-12 pb-28 sm:px-6 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">CeloHT</p><h1 className="mt-3 font-display text-4xl font-semibold text-white">Terms</h1><p className="mt-5 text-sm leading-7 text-parchment-100/70">CeloHT is an open-source interface for Celo wallet, education, community, and impact tools. You are responsible for reviewing every wallet transaction and protecting your wallet credentials. The app is not an investment platform or financial adviser.</p><Link href="/settings" className="mt-6 inline-flex text-sm font-semibold text-gold-300">Back to settings</Link></div>;
}