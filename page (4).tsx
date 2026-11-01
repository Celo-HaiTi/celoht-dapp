"use client";

import { useAccount, useReadContract } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BalanceDisplay } from "@/components/web3/BalanceDisplay";
import { abis, getContractAddress } from "@/lib/contracts";
import { useWalletChainId } from "@/lib/web3/useWalletChainId";

export default function TransactionsPage() {
  const { address, isConnected } = useAccount();
  const chainId = useWalletChainId();
  const servicePaymentsAddress = getContractAddress(chainId, "CeloHTServicePayments");
  const educationPrice = useReadContract({
    address: servicePaymentsAddress,
    abi: abis.CeloHTServicePayments,
    functionName: "priceOf",
    args: [1],
    query: { enabled: Boolean(servicePaymentsAddress) },
  });
  const explorerBase =
    chainId === celoSepolia.id ? "https://celo-sepolia.blockscout.com" : undefined;

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
            <Card>
              <CardTitle>Agent service pricing</CardTitle>
              <CardDescription className="mt-2">
                Education assistance price from CeloHTServicePayments: {educationPrice.data == null ? "Loading" : `${educationPrice.data.toString()} USDm base units`}.
              </CardDescription>
            </Card>
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
