"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    console.error("CeloHT route error:", error);
  }, [error]);

  return <div className="mx-auto max-w-lg px-4 py-12 text-center sm:px-6 lg:px-8"><div role="alert" className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-8"><h2 className="font-display text-xl font-semibold text-white">{t("errors.somethingWentWrong")}</h2><p className="mt-2 text-sm leading-6 text-parchment-100/68">{t("errors.tryAgain")}</p><button type="button" onClick={() => reset()} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-300"><RefreshCw size={15} aria-hidden="true" /> {t("errors.tryAgain")}</button></div></div>;
}