"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Leaf, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Section } from "@/components/Section";
import { StatGrid } from "@/components/StatGrid";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 lg:pt-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-gold-800 dark:text-gold-300 font-mono text-xs font-medium uppercase tracking-[0.2em]">
              Financial inclusion · Web3 learning · Environmental impact
            </p>
            <h1 className="font-display mt-4 max-w-2xl text-5xl leading-[0.96] font-semibold tracking-tight text-ink dark:text-parchment-100 sm:text-6xl">
              Access to digital finance, built for people and communities.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft dark:text-parchment-100/75">
              CeloHT helps people learn, transact, and participate in community programs using a
              secure wallet and practical tools on Celo — without creating a token or pretending to
              be a speculative investment platform.
            </p>
          </div>
          <div className="rounded-2xl border border-navy-700/15 bg-white/60 p-4 shadow-sm dark:border-parchment-100/10 dark:bg-navy-900/80">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft dark:text-parchment-100/60">
              Live wallet
            </p>
            <p className="mt-3 font-display text-3xl font-semibold">Connect to begin</p>
            <p className="mt-2 text-sm text-ink-soft dark:text-parchment-100/60">
              Balances come directly from your wallet on Celo.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/wallet">
              Launch CeloHT <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/education">Start learning</Link>
          </Button>
        </div>
      </section>

      <Section eyebrow="Three pillars" title="One product, built for real community needs">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Wallet className="text-gold-700 dark:text-gold-300" size={22} aria-hidden="true" />
              <CardTitle>Financial inclusion</CardTitle>
            </CardHeader>
            <CardDescription>
              Simple wallet access, CELO and USDm flows, and practical onboarding for everyday digital finance.
            </CardDescription>
            <Link href="/wallet" className="mt-5 inline-flex items-center text-sm font-semibold text-gold-800 dark:text-gold-300">
              Open wallet <ArrowRight size={15} aria-hidden="true" className="ml-1" />
            </Link>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="text-gold-700 dark:text-gold-300" size={22} aria-hidden="true" />
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardDescription>
              Learn digital finance essentials, wallet safety, and responsible blockchain use before transacting.
            </CardDescription>
            <Link href="/education" className="mt-5 inline-flex items-center text-sm font-semibold text-gold-800 dark:text-gold-300">
              Explore learning <ArrowRight size={15} aria-hidden="true" className="ml-1" />
            </Link>
          </Card>

          <Card>
            <CardHeader>
              <Leaf className="text-gold-700 dark:text-gold-300" size={22} aria-hidden="true" />
              <CardTitle>Environmental impact</CardTitle>
            </CardHeader>
            <CardDescription>
              Support community reforestation programs with clear, accountable and clearly labeled impact data.
            </CardDescription>
            <Link href="/impact" className="mt-5 inline-flex items-center text-sm font-semibold text-gold-800 dark:text-gold-300">
              View impact <ArrowRight size={15} aria-hidden="true" className="ml-1" />
            </Link>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Why Celo matters" title="Built for mobile-first access and everyday use">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-navy-700/15 bg-navy-950 p-6 text-parchment-100 dark:border-parchment-100/10">
            <div className="flex items-center gap-2 text-gold-300">
              <ShieldCheck size={18} aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">Why this matters</span>
            </div>
            <p className="mt-4 text-base leading-7 text-parchment-100/80">
              Celo’s mobile-first blockchain design makes it well suited for inclusive digital finance,
              lower-friction wallet onboarding, and community-driven use cases where users need speed,
              affordability, and ease of understanding.
            </p>
          </div>
          <div className="rounded-2xl border border-navy-700/15 bg-parchment-50 p-6 dark:border-parchment-100/10 dark:bg-navy-900">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft dark:text-parchment-100/60">
              What the app does
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft dark:text-parchment-100/75">
              <li>• Connect wallet and monitor CELO/USDm balances</li>
              <li>• Access educational modules and learning progress</li>
              <li>• Review transactions and demo exchange flows</li>
              <li>• Explore agent network and reforestation impact</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section eyebrow="Impact snapshot" title="Verified impact, when available">
        <StatGrid
          stats={[
            { value: "Unavailable", label: "Trees planted" },
            { value: "Unavailable", label: "Active projects" },
            { value: "Unavailable", label: "Verified donations" },
            { value: "Connect", label: "Read on-chain data" },
          ]}
        />
      </Section>
    </>
  );
}
