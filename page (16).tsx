import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common questions about the CeloHT dApp.",
};

const faqs = [
  {
    q: "Do I need a token to use this app?",
    a: "No. CeloHT has no token. You'll need CELO (for gas) and, for donations, USDm — both are Celo ecosystem assets, not something CeloHT issues.",
  },
  {
    q: "Which wallets are supported?",
    a: "Any wallet compatible with Valora, plus any injected browser wallet and, once configured, any WalletConnect-compatible mobile wallet. See SUPPORTED_WALLETS.md.",
  },
  {
    q: "Why do some pages say a contract 'isn't deployed on this network yet'?",
    a: "This app ships with real, tested smart contracts, but they're deployed per network as the project matures — see docs/DEPLOYMENT.md for current status.",
  },
  {
    q: "Is my data private?",
    a: "On-chain actions (registering as an agent, donating, voting) are public by nature of the blockchain. Off-chain preferences, like notification settings, stay in your browser. See PRIVACY_POLICY.md.",
  },
  {
    q: "How do I report a bug or security issue?",
    a: "Bugs: open a GitHub issue. Security vulnerabilities: email security@celoht.com privately — see SECURITY.md.",
  },
];

export default function HelpPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Help" }]} />
      <PageHero
        eyebrow="Help Center"
        title="Common questions"
        lead="Didn't find your answer? Open a discussion on the flagship repository."
      />

      <Section>
        <div className="divide-navy-700/10 dark:divide-parchment-100/10 max-w-3xl divide-y">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:content-none">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-ink-soft dark:text-parchment-100/60 shrink-0 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-ink-soft dark:text-parchment-100/70 mt-3 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
