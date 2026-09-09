"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { t } = useI18n();
  const localized = (label: string) => ({ Dashboard: t("navigation.overview"), Activity: t("navigation.activity"), Profile: t("navigation.profile"), Settings: t("navigation.settings"), Agents: t("navigation.agents"), Learn: t("navigation.learn"), Wallet: t("common.wallet") }[label] ?? label);
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-6 text-sm sm:px-6">
      <ol className="text-ink-soft dark:text-parchment-100/60 flex flex-wrap items-center gap-1">
        <li>
          <Link href="/dashboard" className="hover:text-ink dark:hover:text-parchment-100">
            {t("navigation.overview")}
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="hover:text-ink dark:hover:text-parchment-100">
                {localized(item.label)}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink dark:text-parchment-100">
                {localized(item.label)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
