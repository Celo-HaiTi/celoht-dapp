import test from "node:test";
import assert from "node:assert/strict";
import { buildLessonBlueprint } from "../lib/academy/lessons.ts";

test("household budget lesson contains real educational material and required stages", () => {
  const course = {
    id: "financial-literacy-household-budget-design",
    title: "Household Budget Design",
    summary: "Plan monthly income, allocate spending, and build a resilient household budget.",
    schoolId: "financial-literacy",
    program: "Financial Literacy",
    modules: ["Academic introduction", "Core concepts", "Worked examples", "Practical exercises", "Assessment and reflection"],
    learningObjectives: ["Understand income and expense planning", "Apply the 50/30/20 rule"],
  };

  const lesson = buildLessonBlueprint(course);

  assert.equal(lesson.title, "Household Budget Design");
  assert.equal(lesson.stages.length, 6);
  assert.ok(lesson.stages.some((stage) => stage.title === "Academic Introduction"));
  assert.ok(lesson.stages.some((stage) => stage.title === "Core Concepts"));
  assert.ok(lesson.stages.some((stage) => stage.title === "Knowledge Check and Completion"));
  assert.ok(lesson.summary.toLowerCase().includes("budget"));
  assert.ok(lesson.stages.some((stage) => stage.body.some((text) => text.toLowerCase().includes("income"))));
  assert.ok(!lesson.stages.some((stage) => stage.body.some((text) => text.includes("This lesson explains a practical idea in clear language."))));
  assert.ok(lesson.stages.some((stage) => stage.questions.length > 0));
});
