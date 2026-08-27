import { BookOpen, Leaf, Users, WalletCards } from "lucide-react";

const nodes = [
  { label: "Finance", icon: WalletCards, position: "node-finance" },
  { label: "Learn", icon: BookOpen, position: "node-learn" },
  { label: "Agents", icon: Users, position: "node-agents" },
  { label: "Reforest", icon: Leaf, position: "node-reforest" },
];

export function EcosystemVisual() {
  return <div className="ecosystem-visual"><span className="ecosystem-line ecosystem-line-a" /><span className="ecosystem-line ecosystem-line-b" /><span className="ecosystem-line ecosystem-line-c" /><span className="ecosystem-core" />{nodes.map(({ label, icon: Icon, position }) => <span key={label} className={`ecosystem-node ${position}`}><Icon size={14} aria-hidden="true" /><span>{label}</span></span>)}</div>;
}
