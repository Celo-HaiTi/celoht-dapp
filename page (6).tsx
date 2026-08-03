import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { courses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "The full CeloHT course catalog.",
};

export default function CoursesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Education", href: "/education" }, { label: "Courses" }]} />
      <PageHero
        eyebrow="Education · Courses"
        title="The full catalog"
        lead="Connect your wallet to track progress across these courses — progress is stored locally today and moves to on-chain certificates on completion."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <Badge tone="gold">{course.level}</Badge>
              </CardHeader>
              <CardDescription>{course.summary}</CardDescription>
              <ul className="text-ink-soft dark:text-parchment-100/60 mt-4 space-y-1 text-xs">
                {course.modules.map((module) => (
                  <li key={module}>· {module}</li>
                ))}
              </ul>
              <div className="mt-5">
                <div className="text-ink-soft dark:text-parchment-100/50 mb-1.5 flex justify-between text-xs">
                  <span>Progress</span>
                  <span>Not started</span>
                </div>
                <Progress value={0} />
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
