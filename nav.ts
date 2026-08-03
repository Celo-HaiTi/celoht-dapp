export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Education", href: "/education" },
  { label: "Agents", href: "/agents" },
  { label: "Reforestation", href: "/reforestation" },
  { label: "Governance", href: "/governance" },
  { label: "Community", href: "/community" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Pillars",
    items: [
      { label: "Education", href: "/education" },
      { label: "Courses", href: "/education/courses" },
      { label: "Certificates", href: "/certificates" },
      { label: "Agents", href: "/agents" },
      { label: "Agent Map", href: "/agents/map" },
      { label: "Reforestation", href: "/reforestation" },
      { label: "Projects", href: "/reforestation/projects" },
    ],
  },
  {
    heading: "Ecosystem",
    items: [
      { label: "Governance", href: "/governance" },
      { label: "Donations", href: "/donations" },
      { label: "Impact", href: "/impact" },
      { label: "Partners", href: "/partners" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Transactions", href: "/transactions" },
      { label: "Profile", href: "/profile" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help Center", href: "/help" },
      { label: "GitHub", href: "https://github.com/celo-ht/dapp" },
    ],
  },
];
