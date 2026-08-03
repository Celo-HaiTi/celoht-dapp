export type Partner = {
  name: string;
  category:
    "Ecosystem" | "Local Organization" | "Educational Institution" | "Environmental Partner";
  description: string;
  url: string;
};

// Sample data — see README.md in this folder. Mirrors the categories
// described in the flagship repository's docs/partnerships.md.
export const partners: Partner[] = [
  {
    name: "Celo Public Goods & Ecosystem",
    category: "Ecosystem",
    description: "Grant programs and technical resources within the Celo ecosystem.",
    url: "https://celo.org",
  },
];
