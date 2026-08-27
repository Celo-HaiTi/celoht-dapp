export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Finance", href: "/wallet" },
  { label: "Agents", href: "/agents" },
  { label: "Reforest", href: "/reforestation" },
  { label: "Activity", href: "/wallet/activity" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Trust Center", href: "/trust" },
];
export const footerNav: { heading: string; items: NavItem[] }[] = [
  { heading: "Platform", items: [{ label: "Overview", href: "/" }, { label: "Activity", href: "/wallet/activity" }] },
  { heading: "Pillars", items: [{ label: "Agents", href: "/agents" }, { label: "Learn", href: "/learn" }, { label: "Impact", href: "/impact" }] },
  { heading: "Support", items: [{ label: "Settings", href: "/settings" }, { label: "Help", href: "/help" }] },
];
