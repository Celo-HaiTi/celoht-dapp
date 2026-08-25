import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Community",
  description: "Ways to get involved with CeloHT — events, volunteering, and discussion.",
};

const paths = [
  {
    title: "LinkedIn",
    detail: "Follow CeloHT's professional updates and community news.",
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  },
  {
    title: "Discord",
    detail: "Join the CeloHT community for conversations and collaboration.",
    href: process.env.NEXT_PUBLIC_DISCORD_URL,
  },
  {
    title: "Volunteer locally",
    detail: "Support an education session or a reforestation planting day in your region.",
    href: "https://celoht.com",
  },
];

export default function CommunityPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Community" }]} />
      <PageHero
        eyebrow="Community"
        title="Get involved"
        lead="CeloHT is community-governed — here's how to take part beyond using the app."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {paths.map((path) => path.href ? <a key={path.title} href={path.href} target="_blank" rel="noreferrer">
              <Card className="hover:border-gold-500/50 h-full transition-colors">
                <CardTitle>{path.title}</CardTitle>
                <CardDescription className="mt-2">{path.detail}</CardDescription>
              </Card>
            </a> : <Card key={path.title} className="h-full opacity-75">
              <CardTitle>{path.title}</CardTitle>
              <CardDescription className="mt-2">{path.detail} Add the official link in the production configuration.</CardDescription>
            </Card>)}
        </div>
      </Section>
    </>
  );
}
