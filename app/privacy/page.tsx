import Link from "next/link";

export default function PrivacyPage() {
  return <div className="mx-auto max-w-3xl px-4 py-12 pb-28 sm:px-6 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">CeloHT</p><h1 className="mt-3 font-display text-4xl font-semibold text-white">Privacy</h1><p className="mt-5 text-sm leading-7 text-parchment-100/70">CeloHT does not custody funds or request private keys. Wallet addresses and signed transactions are handled by your wallet provider and public blockchain networks. Local Academy progress stays in your browser until a backend service is connected.</p><Link href="/settings" className="mt-6 inline-flex text-sm font-semibold text-gold-300">Back to settings</Link></div>;
}