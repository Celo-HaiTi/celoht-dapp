export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Impact", href: "/impact" },
  { label: "Agents", href: "/agents" },
  { label: "Community", href: "/community" },
  { label: "Settings", href: "/settings" },
];
export const footerNav: { heading: string; items: NavItem[] }[] = [
  { heading: "Platform", items: [{ label: "Overview", href: "/" }, { label: "Activity", href: "/wallet/activity" }] },
  { heading: "Pillars", items: [{ label: "Agents", href: "/agents" }, { label: "Learn", href: "/learn" }, { label: "Impact", href: "/impact" }] },
  { heading: "Support", items: [{ label: "Settings", href: "/settings" }, { label: "Help", href: "/help" }] },
];
