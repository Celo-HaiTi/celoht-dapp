export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Wallet", href: "/wallet" },
  { label: "Exchange", href: "/exchange" },
  { label: "Transactions", href: "/transactions" },
  { label: "Agents", href: "/agents" },
  { label: "Education", href: "/education" },
  { label: "Impact", href: "/impact" },
  { label: "Governance", href: "/governance" },
  { label: "About", href: "/about" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Platform",
    items: [
      { label: "Overview", href: "/" },
      { label: "Wallet", href: "/wallet" },
      { label: "Exchange", href: "/exchange" },
      { label: "Transactions", href: "/transactions" },
    ],
  },
  {
    heading: "Pillars",
    items: [
      { label: "Agents", href: "/agents" },
      { label: "Education", href: "/education" },
      { label: "Impact", href: "/impact" },
      { label: "Governance", href: "/governance" },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "About", href: "/about" },
      { label: "Community", href: "/community" },
      { label: "Profile", href: "/profile" },
      { label: "Impact", href: "/impact" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Documentation", href: "/education" },
      { label: "GitHub", href: "https://github.com/celo-ht/dapp" },
    ],
  },
];
