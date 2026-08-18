"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Banknote, RefreshCw } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { demoExchangeQuote } from "@/lib/demo-data";

export default function ExchangePage() {
  const [fromAsset, setFromAsset] = useState<"CELO" | "USDm">("CELO");
  const [toAsset, setToAsset] = useState<"CELO" | "USDm">("USDm");
  const [amount, setAmount] = useState("12.5");

  const quote = useMemo(() => {
    const numericAmount = Number(amount) || 0;
    const expected = numericAmount * demoExchangeQuote.rate;
    return {
      expected,
      minimumReceived: expected * (1 - demoExchangeQuote.slippage / 100),
    };
  }, [amount]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Exchange" }]} />
      <PageHero
        eyebrow="Exchange"
        title="Swap between CELO and USDm"
        lead="This flow is intentionally demo-only until a real DEX or bridge is integrated. It presents realistic figures and labels them clearly as sample values."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="from" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">
                  From
                </label>
                <span className="text-xs text-ink-soft dark:text-parchment-100/60">Available: 14.82 CELO</span>
              </div>
              <div className="flex gap-2">
                <select
                  id="from"
                  value={fromAsset}
                  onChange={(event) => setFromAsset(event.target.value as "CELO" | "USDm")}
                  className="rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"
                >
                  <option value="CELO">CELO</option>
                  <option value="USDm">USDm</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  aria-label="Switch assets"
                  onClick={() => {
                    const currentFrom = fromAsset;
                    setFromAsset(toAsset);
                    setToAsset(currentFrom);
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-700/15 bg-parchment-50 dark:border-parchment-100/10 dark:bg-navy-900"
                >
                  <RefreshCw size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="to" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">
                  To
                </label>
                <span className="text-xs text-ink-soft dark:text-parchment-100/60">Available: 428.35 USDm</span>
              </div>
              <div className="flex gap-2">
                <select
                  id="to"
                  value={toAsset}
                  onChange={(event) => setToAsset(event.target.value as "CELO" | "USDm")}
                  className="rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"
                >
                  <option value="CELO">CELO</option>
                  <option value="USDm">USDm</option>
                </select>
                <div className="flex w-full items-center rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10">
                  {quote.expected.toFixed(2)}
                </div>
              </div>

              <Button className="w-full">Review transaction</Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <Banknote size={18} aria-hidden="true" />
              <CardTitle>Quote</CardTitle>
            </CardHeader>
            <CardDescription>Demo data only — no real on-chain swap executed.</CardDescription>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Rate</dt>
                <dd>1 {fromAsset} = {demoExchangeQuote.rate.toFixed(2)} {toAsset}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Estimated received</dt>
                <dd>{quote.expected.toFixed(2)} {toAsset}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Minimum received</dt>
                <dd>{quote.minimumReceived.toFixed(2)} {toAsset}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Network fee</dt>
                <dd>{demoExchangeQuote.networkFee.toFixed(3)} CELO</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Slippage</dt>
                <dd>{demoExchangeQuote.slippage}%</dd>
              </div>
            </dl>
          </Card>
        </div>
      </Section>

      <Section eyebrow="On-chain status" title="Demo-mode safety">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-200">
          <ArrowRightLeft size={18} aria-hidden="true" />
          No transaction has been signed or submitted to a blockchain network from this demo flow.
        </div>
      </Section>
    </>
  );
}
