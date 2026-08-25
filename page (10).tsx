import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { StatGrid } from "@/components/StatGrid";
import { courses } from "@/lib/data/courses";
import { agents } from "@/lib/data/agents";
import { projects } from "@/lib/data/projects";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Impact",
  description: "CeloHT's impact across education, the agent network, and reforestation.",
};

export default function ImpactPage() {
  const activeAgents = agents.filter((a) => a.status === "Active").length;
  const totalTreesGoal = projects.reduce((sum, p) => sum + p.treesGoal, 0);
  const totalTreesPlanted = projects.reduce((sum, p) => sum + p.treesPlanted, 0);

  return (
    <>
      <Breadcrumbs items={[{ label: "Impact" }]} />
      <PageHero
        eyebrow="Impact"
        title="Numbers we can verify"
        lead="Education and agent counts here reflect sample data for local development; reforestation and donation totals read live from ImpactRegistry and DonationManager once deployed — see src/lib/data/README.md."
      />

      <Section eyebrow="Education" title="">
        <StatGrid
          stats={[
            { value: String(courses.length), label: "Courses available" },
            { value: "4", label: "Modules per core course" },
            { value: "Creole-first", label: "Curriculum language" },
          ]}
        />
      </Section>

      <Section eyebrow="Agent network" title="">
        <StatGrid
          stats={[
            { value: String(activeAgents), label: "Active agents" },
            { value: String(agents.length), label: "Total registered" },
            { value: "Léogâne", label: "Pilot region" },
          ]}
        />
      </Section>

      <Section eyebrow="Reforestation" title="">
        <StatGrid
          stats={[
            { value: totalTreesPlanted.toLocaleString(), label: "Trees planted (verified)" },
            { value: totalTreesGoal.toLocaleString(), label: "Combined project goal" },
            { value: String(projects.length), label: "Registered projects" },
          ]}
        />
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-xl font-semibold text-white">Help plant more trees</h2><p className="mt-1 max-w-xl text-sm leading-6 text-parchment-100/65">Support a registered reforestation project with a real USDm donation through your connected wallet.</p></div><Button asChild><Link href="/donations">Donate now</Link></Button></div>
      </Section>
    </>
  );
}
