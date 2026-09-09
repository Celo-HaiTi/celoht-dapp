"use client";

import { useI18n } from "@/lib/i18n/context";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main-content"
      className="focus:bg-gold-500 focus:text-navy-950 sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-lg"
    >
      {t("common.skipToContent")}
    </a>
  );
}
