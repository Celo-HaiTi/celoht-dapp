import { AnimatedCeloHTLogo } from "./AnimatedCeloHTLogo";
import { EcosystemVisual } from "./EcosystemVisual";

export function HeroBackground() {
  return <div className="hero-background" aria-hidden="true"><div className="hero-aura" /><div className="hero-logo-orbit"><AnimatedCeloHTLogo /></div><EcosystemVisual /></div>;
}
