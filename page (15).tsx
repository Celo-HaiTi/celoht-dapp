import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { partners } from "@/lib/data/partners";

export const metadata: Metadata = {
  title: "Partners",
  description: "Organizations CeloHT works with across its three pillars.",
};

export default function PartnersPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Partners" }]} />
      <PageHero
        eyebrow="Partners"
        title="Who we work with"
        lead="See the flagship repository's partnerships documentation for the full strategy and how to start a conversation."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {partners.map((partner) => (
            <a key={partner.name} href={partner.url} target="_blank" rel="noreferrer">
              <Card className="hover:border-gold-500/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle>{partner.name}</CardTitle>
                  <Badge tone="neutral">{partner.category}</Badge>
                </CardHeader>
                <CardDescription>{partner.description}</CardDescription>
              </Card>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
