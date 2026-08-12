import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "About" }]} />
      <PageHero
        eyebrow="About"
        title="CeloHT is a community-first digital finance platform"
        lead="The product is designed to make learning, responsible financial access, and environmental participation feel trustworthy, local, and useful."
      />

      <Section eyebrow="Mission" title="What CeloHT stands for">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardTitle>Financial inclusion</CardTitle>
            <CardDescription className="mt-3">Accessible wallet flows and practical digital finance education for everyday users.</CardDescription>
          </Card>
          <Card>
            <CardTitle>Community trust</CardTitle>
            <CardDescription className="mt-3">Distributed agent support, clear information, and a product that avoids hype or fake certainty.</CardDescription>
          </Card>
          <Card>
            <CardTitle>Environmental action</CardTitle>
            <CardDescription className="mt-3">Transparent reforestation work and impact reporting that is properly labeled when live data is unavailable.</CardDescription>
          </Card>
        </div>
      </Section>

      <Section eyebrow="No token policy" title="CeloHT does not issue a token">
        <p className="max-w-3xl text-sm text-ink-soft dark:text-parchment-100/70">
          This application does not introduce a CeloHT token, tokenomics, or speculative investment model. It uses Celo’s core network infrastructure and demonstrates how educational, community, and environmental tools can live on a mobile-first blockchain ecosystem while remaining careful and transparent.
        </p>
        <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-gold-800 dark:text-gold-300">
          Return to overview →
        </Link>
      </Section>
    </>
  );
}
