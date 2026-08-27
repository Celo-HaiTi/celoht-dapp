"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("CeloHT route error:", error);
  }, [error]);

  return <div className="mx-auto max-w-lg px-4 py-12 text-center sm:px-6 lg:px-8"><div role="alert" className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-8"><h2 className="font-display text-xl font-semibold text-white">This section is temporarily unavailable</h2><p className="mt-2 text-sm leading-6 text-parchment-100/68">This route could not load. Your wallet and other CeloHT sections remain available.</p><button type="button" onClick={() => reset()} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-300"><RefreshCw size={15} aria-hidden="true" /> Try this section again</button></div></div>;
}