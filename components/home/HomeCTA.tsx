import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function PrimaryCTA() {
  return <Link href="#workspace" className="primary-cta">Enter CeloHT <ArrowDown size={16} aria-hidden="true" /></Link>;
}

export function SecondaryCTA() {
  return <Link href="/learn" className="secondary-cta">Explore <ArrowUpRight size={16} aria-hidden="true" /></Link>;
}
