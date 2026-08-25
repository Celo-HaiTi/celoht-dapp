export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Wallet", href: "/wallet" },
  { label: "Transactions", href: "/transactions" },
  { label: "Agents", href: "/agents" },
  { label: "Reforestation", href: "/reforestation" },
  { label: "Education", href: "/education" },
  { label: "Settings", href: "/settings" },
];
export const footerNav: { heading: string; items: NavItem[] }[] = [
  { heading: "Platform", items: [{ label: "Overview", href: "/" }, { label: "Wallet", href: "/wallet" }, { label: "Transactions", href: "/transactions" }] },
  { heading: "Pillars", items: [{ label: "Agents", href: "/agents" }, { label: "Education", href: "/education" }, { label: "Reforestation", href: "/reforestation" }] },
  { heading: "Support", items: [{ label: "Settings", href: "/settings" }, { label: "Help", href: "/help" }] },
];
