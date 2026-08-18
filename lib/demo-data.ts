export type DemoTransaction = {
  id: string;
  type: "Send" | "Receive" | "Exchange" | "Deposit" | "Withdraw";
  asset: "CELO" | "USDm";
  amount: string;
  status: "Pending" | "Successful" | "Failed";
  date: string;
  hash: string;
  from: string;
  to: string;
  demo: boolean;
};

export const celoPriceUsd = 1.22;

export const demoWalletState = {
  address: "0x8A9C1B4Ff1c8A2b0c1d4E11D7c5f7f3EA0b5B2cA",
  network: "Celo Mainnet",
  celoBalance: 14.82,
  usdmBalance: 428.35,
  estimatedValue: 540.27,
  demoMode: true,
};

export const demoTransactions: DemoTransaction[] = [
  {
    id: "tx-001",
    type: "Receive",
    asset: "USDm",
    amount: "+120.00",
    status: "Successful",
    date: "2026-08-10 08:15",
    hash: "0x91d2…010a",
    from: "0xf1ad…2df1",
    to: "0x8A9C…2cA",
    demo: true,
  },
  {
    id: "tx-002",
    type: "Exchange",
    asset: "CELO",
    amount: "-2.5",
    status: "Successful",
    date: "2026-08-09 15:42",
    hash: "0x4bb8…9f01",
    from: "0x8A9C…2cA",
    to: "0x0c2e…17b1",
    demo: true,
  },
  {
    id: "tx-003",
    type: "Send",
    asset: "USDm",
    amount: "-60.00",
    status: "Pending",
    date: "2026-08-09 11:08",
    hash: "0x1e42…8a1d",
    from: "0x8A9C…2cA",
    to: "0x45cf…4e70",
    demo: true,
  },
  {
    id: "tx-004",
    type: "Deposit",
    asset: "CELO",
    amount: "+5.00",
    status: "Successful",
    date: "2026-08-08 06:20",
    hash: "0x823a…4bee",
    from: "0x1aef…5b16",
    to: "0x8A9C…2cA",
    demo: true,
  },
];

export const demoAgents = [
  {
    name: "Amani Jean",
    region: "Léogâne, Haiti",
    status: "Active",
    availability: "Today · 9:00–18:00",
    services: ["Cash-in", "Cash-out", "Wallet setup"],
    assets: ["CELO", "USDm"],
    rating: 4.9,
  },
  {
    name: "Marie Laurent",
    region: "Port-au-Prince, Haiti",
    status: "Active",
    availability: "Today · 10:00–17:00",
    services: ["Remittances", "Education support"],
    assets: ["CELO", "USDm"],
    rating: 4.8,
  },
  {
    name: "Renel Dorsainvil",
    region: "Cap-Haïtien, Haiti",
    status: "Pending",
    availability: "Next open window · Tue",
    services: ["Cash-out", "Reforestation onboarding"],
    assets: ["CELO"],
    rating: 4.6,
  },
];

export const demoCourses = [
  {
    title: "Financial literacy for everyday life",
    category: "Financial Literacy",
    level: "Beginner",
    minutes: 22,
    progress: 78,
    summary: "Learn budgeting, saving, and how to protect your money before using digital wallets.",
  },
  {
    title: "How USDm works",
    category: "Stablecoins",
    level: "Beginner",
    minutes: 18,
    progress: 52,
    summary: "Understand stable value, transaction safety, and why USDm is useful in daily life.",
  },
  {
    title: "Wallet safety fundamentals",
    category: "Security",
    level: "Intermediate",
    minutes: 25,
    progress: 34,
    summary: "Recognize phishing, secure seed handling, and practical wallet safety habits.",
  },
  {
    title: "The Celo ecosystem explained",
    category: "Celo",
    level: "Intermediate",
    minutes: 31,
    progress: 61,
    summary: "Explore Celo’s mission, mobile-first design, and the role of CELO and USDm.",
  },
];

export const demoImpact = {
  treesPlanted: 46840,
  communities: 14,
  projects: 6,
  volunteers: 2408,
  impactLabel: "Demo data",
};

export const demoProposals = [
  {
    id: 1,
    title: "Community education voucher program",
    status: "Active",
    summary: "Expand the learning module pool and fund local training with a transparent community review process.",
    votesFor: 142,
    votesAgainst: 18,
  },
  {
    id: 2,
    title: "Agent verification standards",
    status: "Draft",
    summary: "Define the review pathway for newly approved cash-in/cash-out agents working in rural communities.",
    votesFor: 88,
    votesAgainst: 10,
  },
];

export const demoTreasury = {
  address: "0x0000000000000000000000000000000000000000",
  configured: false,
};

export const demoReforestationProjects = [
  {
    name: "Morne l’Hôpital Grove",
    location: "Haiti",
    trees: 12000,
    goal: 15000,
    status: "Active",
    summary: "Community-led restoration of a degraded watershed zone with local nursery training.",
  },
  {
    name: "Léogâne Riverbank Forest",
    location: "Haiti",
    trees: 9600,
    goal: 12000,
    status: "Active",
    summary: "Revegetation and erosion control along an important river corridor close to local families.",
  },
  {
    name: "Cap-Haïtien Coastal Mix",
    location: "Haiti",
    trees: 7300,
    goal: 10000,
    status: "Planning",
    summary: "Coastal resilience work focused on species suited to dry, exposed terrain.",
  },
];

export const demoExchangeQuote = {
  from: "CELO",
  to: "USDm",
  rate: 1.11,
  minimumReceived: 120.18,
  networkFee: 0.008,
  slippage: 0.5,
};
