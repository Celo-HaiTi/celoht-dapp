import test from "node:test";
import assert from "node:assert/strict";
import { academySchools, courses, academyCourseCount } from "../courses.ts";

test("academy catalog has all required faculties and launch catalog size", () => {
  assert.equal(academySchools.length, 15);
  assert.equal(courses.length, 150);
  assert.equal(academyCourseCount, 150);
  assert.ok(academySchools.every((school) => school.courses.length >= 10));
});

test("every course includes academic metadata and progression data", () => {
  const sample = courses[0];
  assert.ok(sample.id);
  assert.ok(sample.title);
  assert.ok(sample.summary);
  assert.ok(sample.level);
  assert.ok(Array.isArray(sample.modules));
  assert.ok(Array.isArray(sample.prerequisites));
  assert.ok(Array.isArray(sample.learningObjectives));
  assert.ok(Array.isArray(sample.syllabus));
  assert.ok(Array.isArray(sample.practicalExercises));
  assert.ok(sample.durationMinutes > 0);
  assert.ok(sample.schoolId);
  assert.ok(!Object.keys(sample).some((key) => key.toLowerCase().includes("video")));
});
