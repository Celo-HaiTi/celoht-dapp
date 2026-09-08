"use client";

import { ArrowRightLeft, Banknote } from "lucide-react";
import { useAccount } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ExchangePage() {
  const { isConnected } = useAccount();

  return (
    <>
      <Breadcrumbs items={[{ label: "Exchange" }]} />
      <PageHero
        eyebrow="Exchange"
        title="Exchange unavailable"
        lead="A verified Celo DEX or bridge is not configured for this deployment. No exchange quote or transaction is available."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <Banknote size={18} aria-hidden="true" />
              <CardTitle>Swap service</CardTitle>
            </CardHeader>
            <CardDescription>Unavailable until an official exchange integration provides live quotes and receipt-confirmed transactions.</CardDescription>
            <div className="mt-5 rounded-xl border border-navy-700/15 p-4 text-sm dark:border-parchment-100/10">
              <p className="font-medium">Status: Not configured</p>
              <p className="mt-2 text-ink-soft dark:text-parchment-100/60">{isConnected ? "Your wallet is connected, but no swap route is enabled." : "Connect a wallet after an official swap route is enabled."}</p>
            </div>
          </Card>
        </div>
      </Section>

      <Section eyebrow="On-chain status" title="Demo-mode safety">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-200">
          <ArrowRightLeft size={18} aria-hidden="true" />
          No exchange transaction can be signed or submitted until a verified swap integration is configured.
        </div>
      </Section>
    </>
  );
}
