import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { agents } from "@/lib/data/agents";
import { shortenAddress } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "Find a verified CeloHT community agent for cash-in, cash-out, and hands-on support.",
};

const statusTone = { Active: "forest", Pending: "warning", Suspended: "danger" } as const;

export default function AgentsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Agents" }]} />
      <PageHero
        eyebrow="Pillar 02 · Agent Network"
        title="Trained people, not just an app"
        lead="Browse the current directory and verify each agent's status before requesting a service. Directory entries are sample data until an indexer and profile service are configured."
      />

      <Section eyebrow={`${agents.length} directory entries · SAMPLE`} title="Directory">
        <Button asChild variant="secondary" className="mb-6">
          <Link href="/agents/map">View on map</Link>
        </Button>
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((agent) => (
            <Card key={agent.address}>
              <CardHeader>
                <CardTitle>{agent.displayName}</CardTitle>
                <Badge tone={statusTone[agent.status]}>{agent.status}</Badge>
              </CardHeader>
              <CardDescription>{agent.region}</CardDescription>
              <p className="text-ink-soft dark:text-parchment-100/50 mt-3 font-mono text-xs">
                {shortenAddress(agent.address)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.services.map((service) => (
                  <Badge key={service} tone="neutral">
                    {service}
                  </Badge>
                ))}
              </div>
              {agent.rating > 0 && (
                <p className="text-ink-soft dark:text-parchment-100/70 mt-3 text-sm">
                  ★ {agent.rating.toFixed(1)} community rating
                </p>
              )}
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Want to become an agent?" title="">
        <p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">
          Agents self-register on-chain via <code>AgentRegistry.registerAgent</code> after
          completing the education program, then wait for approval from a network coordinator. See
          the flagship repository&rsquo;s{" "}
          <a
            href="https://github.com/Celo-HaiTi/celoht/blob/main/docs/agent-network.md"
            className="underline underline-offset-2"
          >
            agent network documentation
          </a>{" "}
          for the full process.
        </p>
      </Section>
    </>
  );
}
