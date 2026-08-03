import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Reforestation",
  description: "Verified tree-planting projects, supportable directly in cUSD.",
};

export default function ReforestationPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Reforestation" }]} />
      <PageHero
        eyebrow="Pillar 03 · Reforestation"
        title="Growth you can verify"
        lead="Every tree counted here is tied to a planting record submitted by a VERIFIER_ROLE holder on-chain, with photo and geolocation evidence pinned to IPFS — not a self-reported number."
      />

      <Section eyebrow="How it works" title="">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-forest-500/30 rounded-2xl border p-6">
            <h3 className="font-semibold">1. A project is registered</h3>
            <p className="text-ink-soft dark:text-parchment-100/70 mt-2 text-sm">
              An admin creates a project in ImpactRegistry and DonationManager.
            </p>
          </div>
          <div className="border-forest-500/30 rounded-2xl border p-6">
            <h3 className="font-semibold">2. Planting is verified</h3>
            <p className="text-ink-soft dark:text-parchment-100/70 mt-2 text-sm">
              A verifier logs tree counts with evidence, recorded permanently on-chain.
            </p>
          </div>
          <div className="border-forest-500/30 rounded-2xl border p-6">
            <h3 className="font-semibold">3. You can support it</h3>
            <p className="text-ink-soft dark:text-parchment-100/70 mt-2 text-sm">
              Donate cUSD directly to a project through the Donations page.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <Button asChild>
          <Link href="/reforestation/projects">View all projects</Link>
        </Button>
      </Section>
    </>
  );
}
