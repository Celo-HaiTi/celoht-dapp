"use client";

import { useAccount, useChainId } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { shortenAddress } from "@/lib/utils";

export default function ProfilePage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();

  return (
    <>
      <Breadcrumbs items={[{ label: "Profile" }]} />
      <PageHero
        eyebrow="Profile"
        title="Your CeloHT identity"
        lead="Your profile is your wallet — nothing here is stored by CeloHT beyond what's already public on-chain."
      />

      <Section>
        {!isConnected || !address ? (
          <Card className="max-w-md">
            <CardTitle>No wallet connected</CardTitle>
            <CardDescription className="mt-2">
              Connect a wallet using the button in the header to view your profile.
            </CardDescription>
          </Card>
        ) : (
          <Card className="max-w-lg">
            <CardTitle>{shortenAddress(address, 6)}</CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">{address}</CardDescription>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-ink-soft dark:text-parchment-100/50 text-xs tracking-wide uppercase">
                  Network
                </dt>
                <dd className="mt-1">{chain?.name ?? `Chain ${chainId}`}</dd>
              </div>
              <div>
                <dt className="text-ink-soft dark:text-parchment-100/50 text-xs tracking-wide uppercase">
                  Wallet type
                </dt>
                <dd className="mt-1">Valora-compatible</dd>
              </div>
            </dl>
          </Card>
        )}
      </Section>

      <Section eyebrow="Related" title="">
        <p className="text-ink-soft dark:text-parchment-100/70 text-sm">
          See your{" "}
          <a href="/certificates" className="underline underline-offset-2">
            certificates
          </a>{" "}
          and{" "}
          <a href="/dashboard" className="underline underline-offset-2">
            dashboard
          </a>{" "}
          for activity tied to this wallet.
        </p>
      </Section>
    </>
  );
}
