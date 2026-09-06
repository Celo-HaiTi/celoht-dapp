"use client";

import { useChainId, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { projects } from "@/lib/data/projects";

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const chainId = useChainId();
  const deployed = isContractDeployed(chainId, "CeloHTReforestation");

  const onChainTrees = useReadContract({
    address: getContractAddress(chainId, "CeloHTReforestation"),
    abi: abis.CeloHTReforestation,
    functionName: "totalDonated",
    query: { enabled: deployed },
  });

  const treesPlanted = deployed && onChainTrees.data !== undefined ? Number(onChainTrees.data) : undefined;
  const progressPct = treesPlanted === undefined ? 0 : Math.min(100, (treesPlanted / project.treesGoal) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <Badge tone={project.status === "Active" ? "forest" : "neutral"}>{project.status}</Badge>
      </CardHeader>
      <CardDescription>{project.summary}</CardDescription>
      <div className="mt-4">
        <div className="text-ink-soft dark:text-parchment-100/50 mb-1.5 flex justify-between text-xs">
          <span>
            {treesPlanted === undefined ? "Verified count unavailable" : `${treesPlanted.toLocaleString()} verified trees`}
          </span>
          <span>{progressPct.toFixed(0)}%</span>
        </div>
        <Progress value={progressPct} />
      </div>
      {!deployed && (
        <p className="text-ink-soft dark:text-parchment-100/50 mt-3 text-xs">
          Verified reforestation totals are unavailable until CeloHTReforestation is deployed on this network.
        </p>
      )}
    </Card>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Reforestation", href: "/reforestation" }, { label: "Projects" }]}
      />
      <PageHero
        eyebrow="Reforestation · Projects"
        title="All registered projects"
        lead="Reforestation totals read live from CeloHTReforestation; the protocol does not claim a fixed tree conversion rate."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
}
