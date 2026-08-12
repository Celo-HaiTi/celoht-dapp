"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Download, Send, ShieldAlert, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { demoTransactions, demoWalletState } from "@/lib/demo-data";
import { formatCurrency, validateTransferInput } from "@/lib/demo-wallet";

export default function WalletPage() {
  const [asset, setAsset] = useState<"CELO" | "cUSD">("cUSD");
  const [amount, setAmount] = useState("25");
  const [recipient, setRecipient] = useState("0x1234567890123456789012345678901234567890");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validation = useMemo(
    () =>
      validateTransferInput({
        asset,
        amount,
        recipient,
        balance: asset === "CELO" ? demoWalletState.celoBalance : demoWalletState.cUsdBalance,
        isConnected: false,
        wrongNetwork: false,
      }),
    [amount, asset, recipient],
  );

  const handlePreview = () => setIsSubmitted(true);

  return (
    <>
      <Breadcrumbs items={[{ label: "Wallet" }]} />
      <PageHero
        eyebrow="Wallet"
        title="Manage your Celo wallet safely"
        lead="This interface supports the real wallet flow shape while clearly staying in demo account state when live blockchain access is unavailable."
      />

      <Section eyebrow="Portfolio" title="Account overview">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Wallet size={18} aria-hidden="true" />
              <CardTitle>CELO</CardTitle>
            </CardHeader>
            <p className="font-display text-3xl font-semibold">{demoWalletState.celoBalance.toFixed(2)}</p>
            <CardDescription className="mt-2">≈ {formatCurrency(demoWalletState.celoBalance * 1.22)}</CardDescription>
          </Card>
          <Card>
            <CardHeader>
              <Download size={18} aria-hidden="true" />
              <CardTitle>cUSD</CardTitle>
            </CardHeader>
            <p className="font-display text-3xl font-semibold">{demoWalletState.cUsdBalance.toFixed(2)}</p>
            <CardDescription className="mt-2">≈ {formatCurrency(demoWalletState.cUsdBalance)}</CardDescription>
          </Card>
          <Card>
            <CardHeader>
              <ShieldAlert size={18} aria-hidden="true" />
              <CardTitle>Network</CardTitle>
            </CardHeader>
            <p className="font-display text-3xl font-semibold">Celo</p>
            <CardDescription className="mt-2">Demo mode · no wallet connected</CardDescription>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Send" title="Transfer funds">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="space-y-4">
              <div>
                <label htmlFor="asset" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">
                  Asset
                </label>
                <select
                  id="asset"
                  value={asset}
                  onChange={(event) => setAsset(event.target.value as "CELO" | "cUSD")}
                  className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"
                >
                  <option value="CELO">CELO</option>
                  <option value="cUSD">cUSD</option>
                </select>
              </div>

              <div>
                <label htmlFor="recipient" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">
                  Recipient
                </label>
                <input
                  id="recipient"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"
                />
              </div>

              <div>
                <label htmlFor="amount" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"
                />
              </div>

              {validation.error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
                  {validation.error}
                </p>
              )}

              <Button onClick={handlePreview} className="w-full" disabled={!validation.valid && amount.length > 0}>
                Review transfer
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <Send size={18} aria-hidden="true" />
              <CardTitle>Transfer summary</CardTitle>
            </CardHeader>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Asset</dt>
                <dd>{asset}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Amount</dt>
                <dd>{amount || "0.00"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Network fee</dt>
                <dd>0.005 CELO</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft dark:text-parchment-100/60">Balance</dt>
                <dd>{asset === "CELO" ? demoWalletState.celoBalance.toFixed(2) : demoWalletState.cUsdBalance.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-xl border border-dashed border-navy-700/20 p-3 text-xs text-ink-soft dark:border-parchment-100/15 dark:text-parchment-100/65">
              {isSubmitted ? "Demo transfer prepared — no blockchain transaction executed." : "No live transaction yet. Demo state only."}
            </div>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Recent activity" title="Demo transaction history">
        <div className="space-y-3">
          {demoTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-col gap-2 rounded-2xl border border-navy-700/10 bg-parchment-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-parchment-100/10 dark:bg-navy-900/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tx.type}</span>
                  <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-gold-800 dark:text-gold-300">
                    {tx.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft dark:text-parchment-100/60">{tx.asset} {tx.amount} · {tx.date}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-soft dark:text-parchment-100/60">
                <span>{tx.hash}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
