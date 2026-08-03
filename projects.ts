export type ReforestationProject = {
  id: string;
  name: string;
  region: string;
  summary: string;
  treesPlanted: number;
  treesGoal: number;
  donationsUsd: number;
  status: "Pilot" | "Active" | "Completed";
};

// Sample data — see README.md in this folder. In production, treesPlanted
// sums ImpactRegistry.totalTreesFor(projectId) and donationsUsd sums
// DonationManager.totalDonatedTo(projectId).
export const projects: ReforestationProject[] = [
  {
    id: "reforest-leogane-01",
    name: "Léogâne Watershed Pilot",
    region: "Léogâne, Ouest",
    summary:
      "A pilot planting program along the Léogâne watershed, coordinated by local community agents.",
    treesPlanted: 0,
    treesGoal: 1000,
    donationsUsd: 0,
    status: "Pilot",
  },
];

export const donationProjects = projects.map((project) => ({
  id: project.id,
  name: project.name,
  summary: project.summary,
}));
