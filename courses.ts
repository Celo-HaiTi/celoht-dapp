export type Course = {
  id: string;
  title: string;
  pillar: "education";
  summary: string;
  modules: string[];
  durationMinutes: number;
  language: "Haitian Creole" | "English";
  level: "Beginner" | "Intermediate";
};

// Sample data — see README.md in this folder. Mirrors the curriculum
// described in the flagship repository's docs/education.md.
export const courses: Course[] = [
  {
    id: "financial-literacy-101",
    title: "Basic Financial Literacy",
    pillar: "education",
    summary: "Budgeting, saving, risk management, and the concept of interest.",
    modules: [
      "Budgeting basics",
      "Saving habits",
      "Understanding risk",
      "Interest, simply explained",
    ],
    durationMinutes: 90,
    language: "Haitian Creole",
    level: "Beginner",
  },
  {
    id: "blockchain-web3-fundamentals",
    title: "Blockchain & Web3 Fundamentals",
    pillar: "education",
    summary: "What a blockchain is and how a transaction works, in plain language.",
    modules: [
      "What is a blockchain",
      "How a transaction works",
      "Wallets vs. exchanges",
      "Public vs. private keys",
    ],
    durationMinutes: 75,
    language: "Haitian Creole",
    level: "Beginner",
  },
  {
    id: "hands-on-valora-cusd",
    title: "Hands-On Valora & cUSD",
    pillar: "education",
    summary: "Step-by-step guided use, with heavy emphasis on seed-phrase security.",
    modules: [
      "Installing Valora",
      "Your first wallet",
      "Sending and receiving cUSD",
      "Protecting your seed phrase",
    ],
    durationMinutes: 60,
    language: "Haitian Creole",
    level: "Beginner",
  },
  {
    id: "crypto-risk-awareness",
    title: "Crypto Risk Awareness",
    pillar: "education",
    summary: "Volatility, common scams, and never risking more than you can afford to lose.",
    modules: [
      "Common scam patterns",
      "Volatility explained",
      "Verifying official channels",
      "When to ask for help",
    ],
    durationMinutes: 45,
    language: "Haitian Creole",
    level: "Intermediate",
  },
];
