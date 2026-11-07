import Link from "next/link";
import { LifeBuoy, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function HelpPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Help" }]} />
      <PageHero
        eyebrow="Support"
        title="How can we help?"
        lead="Find wallet and account support while keeping control of your wallet and personal information."
      />
      <Section>
        <div className="grid max-w-5xl gap-4 sm:grid-cols-2">
          <Card className="help-card">
            <CardHeader>
              <span className="help-icon"><LifeBuoy size={19} aria-hidden="true" /></span>
              <CardTitle>Wallet support</CardTitle>
            </CardHeader>
            <CardDescription>
              Connect to Celo Sepolia (chain ID 11142220) for supported CeloHT wallet actions. CeloHT cannot recover funds or wallet credentials.
            </CardDescription>
            <Link className="help-link mt-5" href="/wallet">Open Finance</Link>
          </Card>
          <Card className="help-card">
            <CardHeader>
              <span className="help-icon help-icon-forest"><ShieldCheck size={19} aria-hidden="true" /></span>
              <CardTitle>Stay secure</CardTitle>
            </CardHeader>
            <CardDescription>
              Only confirm transactions you understand. Review the <Link className="help-inline-link" href="/education">Web3 security lessons</Link> before sending assets.
            </CardDescription>
            <Link className="help-link mt-5" href="/trust">Open Trust Center</Link>
          </Card>
        </div>
      </Section>
    </>
  );
}
