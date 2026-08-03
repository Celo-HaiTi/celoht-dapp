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
    title: "Join a discussion",
    detail: "Ask questions and share ideas in the flagship repository's Discussions.",
    href: "https://github.com/celo-ht/celoht/discussions",
  },
  {
    title: "Volunteer locally",
    detail: "Support an education session or a reforestation planting day in your region.",
    href: "https://github.com/celo-ht/celoht/blob/main/docs/agent-network.md",
  },
  {
    title: "Contribute to the dApp",
    detail: "This app is open source — see the contributing guide for how to help.",
    href: "https://github.com/celo-ht/dapp/blob/main/CONTRIBUTING.md",
  },
  {
    title: "Follow announcements",
    detail: "News and updates are posted to the flagship repository and social channels.",
    href: "https://twitter.com/CeloHtOfficial",
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
          {paths.map((path) => (
            <a key={path.title} href={path.href} target="_blank" rel="noreferrer">
              <Card className="hover:border-gold-500/50 h-full transition-colors">
                <CardTitle>{path.title}</CardTitle>
                <CardDescription className="mt-2">{path.detail}</CardDescription>
              </Card>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
