"use client";

import { useEffect } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    console.error("CeloHT route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <section role="alert" className="celoht-state-panel error">
        <div className="celoht-state-header">
          <div className="flex items-center gap-3">
            <CircleAlert className="text-celoht-danger" size={20} aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-white">{t("errors.somethingWentWrong")}</h2>
          </div>
          <span className="celoht-state-badge">CeloHT</span>
        </div>
        <p className="relative z-[1] mt-3 text-sm leading-6 text-parchment-100/68">{t("errors.tryAgain")}</p>
        <Button className="relative z-[1] mt-5" onClick={() => reset()}>
          <RefreshCw size={15} aria-hidden="true" /> {t("errors.tryAgain")}
        </Button>
      </section>
    </div>
  );
}