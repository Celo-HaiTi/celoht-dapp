export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Wallet", href: "/wallet" },
  { label: "Transactions", href: "/transactions" },
  { label: "Agents", href: "/agents" },
  { label: "Reforestation", href: "/reforestation" },
  { label: "Education", href: "/education" },
  { label: "Settings", href: "/settings" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Platform",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Wallet", href: "/wallet" },
      { label: "Activity", href: "/transactions" },
    ],
  },
  {
    heading: "Pillars",
    items: [
      { label: "Agents", href: "/agents" },
      { label: "Learn", href: "/education" },
      { label: "Reforestation", href: "/reforestation" },
      { label: "Impact", href: "/impact" },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "Settings", href: "/settings" },
      { label: "Help", href: "/help" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Documentation", href: "/education" },
      { label: "GitHub", href: "https://github.com/Celo-HaiTi/celoht-dapp" },
    ],
  },
];
