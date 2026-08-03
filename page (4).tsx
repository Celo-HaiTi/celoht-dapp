"use client";

import { useAccount, useChainId } from "wagmi";
import { celo } from "wagmi/chains";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BalanceDisplay } from "@/components/web3/BalanceDisplay";

export default function TransactionsPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const explorerBase =
    chainId === celo.id ? "https://celoscan.io" : "https://alfajores.celoscan.io";

  return (
    <>
      <Breadcrumbs items={[{ label: "Transactions" }]} />
      <PageHero
        eyebrow="Wallet · Transactions"
        title="Your balances and activity"
        lead="A full in-app transaction history requires an indexer reading events from Celo — see docs/API.md. Until that's wired up, this page links out to a block explorer for the full picture."
      />

      <Section>
        {!isConnected ? (
          <Card className="max-w-md">
            <CardTitle>Connect your wallet</CardTitle>
            <CardDescription className="mt-2">
              Connect to see your balances and jump to your full history on Celoscan.
            </CardDescription>
          </Card>
        ) : (
          <div className="space-y-6">
            <BalanceDisplay />
            <Button asChild variant="secondary">
              <a href={`${explorerBase}/address/${address}`} target="_blank" rel="noreferrer">
                View full history on Celoscan ↗
              </a>
            </Button>
          </div>
        )}
      </Section>

      <Section eyebrow="Roadmap" title="What's coming">
        <p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">
          A future release will index <code>Donated</code>, <code>CertificateIssued</code>, and{" "}
          <code>PlantingRecorded</code> events directly, so this page can show CeloHT-specific
          activity inline instead of linking out — see the flagship repository&rsquo;s roadmap.
        </p>
      </Section>
    </>
  );
}
