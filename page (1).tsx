import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { communityChannels } from "@/lib/community";

export const metadata: Metadata = {
  title: "Community",
  description: "Ways to get involved with CeloHT — events, volunteering, and discussion.",
};

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
          {communityChannels.map((channel) => <a key={channel.platform} href={channel.url} target="_blank" rel="noopener noreferrer">
              <Card className="hover:border-gold-500/50 h-full transition-colors">
                <CardTitle>{channel.platform} · {channel.title}</CardTitle>
                <CardDescription className="mt-2">{channel.detail}</CardDescription>
              </Card>
            </a>)}
        </div>
      </Section>
    </>
  );
}
