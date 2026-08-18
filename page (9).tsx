import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { StatGrid } from "@/components/StatGrid";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "CeloHT dApp",
  description:
    "Learn, connect with community agents, and support reforestation — the official CeloHT dApp on Celo.",
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 lg:pt-24">
        <p className="text-gold-800 dark:text-gold-300 font-mono text-xs tracking-[0.2em] uppercase">
          Built on Celo · Compatible with Valora · No token, ever
        </p>
        <h1 className="font-display mt-4 max-w-2xl text-5xl leading-[1.05] font-semibold sm:text-6xl">
          One app for CeloHT&rsquo;s three pillars.
        </h1>
        <p className="text-ink-soft dark:text-parchment-100/75 mt-6 max-w-xl text-lg">
          Learn financial and Web3 basics, find a trained community agent nearby, and support
          verified reforestation — all connected to your Valora-compatible wallet.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/education">Start learning</Link>
          </Button>
        </div>
      </section>

      <Section eyebrow="Three pillars, one app" title="">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <span aria-hidden="true" className="text-2xl">
                📘
              </span>
            </CardHeader>
            <CardDescription>
              Courses, quizzes, and progress tracking, with soulbound on-chain certificates when you
              finish.
            </CardDescription>
            <Link
              href="/education"
              className="text-gold-800 dark:text-gold-300 mt-4 inline-block text-sm font-medium"
            >
              Explore courses →
            </Link>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Agent Network</CardTitle>
              <span aria-hidden="true" className="text-2xl">
                🤝
              </span>
            </CardHeader>
            <CardDescription>
              Find a verified community agent near you for cash-in, cash-out, and hands-on support.
            </CardDescription>
            <Link
              href="/agents"
              className="text-gold-800 dark:text-gold-300 mt-4 inline-block text-sm font-medium"
            >
              Find an agent →
            </Link>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reforestation</CardTitle>
              <span aria-hidden="true" className="text-2xl">
                🌱
              </span>
            </CardHeader>
            <CardDescription>
              Track verified tree-planting projects and support them directly in USDm.
            </CardDescription>
            <Link
              href="/reforestation"
              className="text-gold-800 dark:text-gold-300 mt-4 inline-block text-sm font-medium"
            >
              View projects →
            </Link>
          </Card>
        </div>
      </Section>

      <Section eyebrow="What this app is not" title="">
        <div className="border-navy-700/15 text-ink-soft dark:border-parchment-100/10 dark:text-parchment-100/70 max-w-3xl rounded-2xl border p-6 text-sm">
          The CeloHT dApp is not an exchange, not a DeFi protocol, and does not create or trade any
          token. It reads and writes to a small set of open-source registry contracts (agent status,
          certificates, donations, reforestation records, and governance votes) and connects to your
          own Valora-compatible wallet — CeloHT never holds your keys.
        </div>
      </Section>

      <Section eyebrow="Where things stand" title="">
        <StatGrid
          stats={[
            { value: "5", label: "Open-source contracts" },
            { value: "30/30", label: "Contract tests passing" },
            { value: "0", label: "Tokens issued" },
            { value: "Testnet", label: "Current deployment stage" },
          ]}
        />
      </Section>
    </>
  );
}
