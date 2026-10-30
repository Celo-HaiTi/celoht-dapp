import { ShieldCheck } from "lucide-react";

export function PilotNotice() {
  return (
    <div className="border-b border-gold-500/15 bg-gold-500/[0.07] px-4 py-2 text-center text-xs text-parchment-100/72 lg:ml-64">
      <p className="mx-auto inline-flex max-w-4xl items-center justify-center gap-2 leading-5">
        <ShieldCheck size={14} className="shrink-0 text-gold-300" aria-hidden="true" />
        <strong className="text-gold-300">CeloHT Testnet Pilot</strong>
        <span>Explore, learn and test community-powered digital services. Testnet transactions have no real monetary value.</span>
      </p>
    </div>
  );
}
