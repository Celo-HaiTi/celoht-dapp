import test from "node:test";
import assert from "node:assert/strict";
import { academySchools, courses, academyCourseCount } from "../courses.ts";

test("academy catalog has all required faculties and launch catalog size", () => {
  assert.equal(academySchools.length, 11);
  assert.equal(courses.length, 78);
  assert.equal(academyCourseCount, 78);
  assert.ok(academySchools.every((school) => school.courses.length > 0));
});

test("every course includes academic metadata and progression data", () => {
  const sample = courses[0];
  assert.ok(sample.id);
  assert.ok(sample.title);
  assert.ok(sample.summary);
  assert.ok(sample.level);
  assert.ok(Array.isArray(sample.modules));
  assert.ok(Array.isArray(sample.prerequisites));
  assert.ok(sample.durationMinutes > 0);
  assert.ok(sample.schoolId);
});
