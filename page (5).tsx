import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { courses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Financial literacy and Web3 fundamentals, in Haitian Creole, before any tool is introduced.",
};

export default function EducationPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Education" }]} />
      <PageHero
        eyebrow="Pillar 01 · Education"
        title="Understanding comes before access"
        lead="Four core modules — financial literacy, blockchain fundamentals, hands-on Valora/USDm use, and risk awareness — each with a quiz and a certificate on completion."
      />

      <Section eyebrow="Curriculum" title={`${courses.length} modules available`}>
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/learn/${course.id}`}
              className="border-gold-500/30 dark:border-gold-500/20 rounded-2xl border p-6"
            >
              <h3 className="font-display text-xl font-semibold">{course.title}</h3>
              <p className="text-ink-soft dark:text-parchment-100/70 mt-2 text-sm">
                {course.summary}
              </p>
              <p className="text-ink-soft dark:text-parchment-100/50 mt-4 font-mono text-xs tracking-wide uppercase">
                {course.durationMinutes} min · {course.level} · {course.language}
              </p>
            </Link>
          ))}
        </div>
        <Button asChild className="mt-8">
          <Link href="/education/courses">Browse full course catalog</Link>
        </Button>
      </Section>

      <Section eyebrow="On completion" title="A soulbound certificate">
        <p className="text-ink-soft dark:text-parchment-100/70 max-w-3xl text-sm">
          Finishing a course issues a non-transferable ERC-721 certificate to your connected wallet
          — a portable, verifiable record of what you&rsquo;ve learned, not a collectible. See{" "}
          <Link href="/certificates" className="underline underline-offset-2">
            your certificates
          </Link>{" "}
          once connected.
        </p>
      </Section>
    </>
  );
}
