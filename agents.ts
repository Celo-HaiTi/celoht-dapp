export type Agent = {
  address: `0x${string}`;
  displayName: string;
  region: string;
  status: "Active" | "Pending" | "Suspended";
  services: Array<"cash-in" | "cash-out" | "p2p-transfer" | "onboarding">;
  rating: number; // 0-5, off-chain aggregate
  lat: number;
  lng: number;
};

// Sample data — see README.md in this folder. In production this is a
// join between AgentRegistry.agentsPage() on-chain reads and off-chain
// profile metadata (name, coordinates) resolved from each agent's
// metadataURI.
export const agents: Agent[] = [
  {
    address: "0x1111111111111111111111111111111111aaaa",
    displayName: "Jean M. — Léogâne Centre",
    region: "Léogâne, Ouest",
    status: "Active",
    services: ["cash-in", "cash-out", "onboarding"],
    rating: 4.8,
    lat: 18.5119,
    lng: -72.6338,
  },
  {
    address: "0x2222222222222222222222222222222222bbbb",
    displayName: "Marie-Ange D. — Gressier",
    region: "Gressier, Ouest",
    status: "Active",
    services: ["cash-in", "cash-out", "p2p-transfer"],
    rating: 4.6,
    lat: 18.5486,
    lng: -72.5442,
  },
  {
    address: "0x3333333333333333333333333333333333cccc",
    displayName: "Wilkens P. — Petit-Goâve",
    region: "Petit-Goâve, Ouest",
    status: "Pending",
    services: ["onboarding"],
    rating: 0,
    lat: 18.4373,
    lng: -72.8664,
  },
];
