import test from "node:test";
import assert from "node:assert/strict";
import {
  createMemoryStorage,
  enrollCourse,
  getAcademyState,
  getCertificateRecords,
  markCourseComplete,
} from "../lib/academy/state.ts";

test("academy state can enroll, track completion, and issue certificate records", () => {
  const storage = createMemoryStorage();
  const enrolled = enrollCourse("intro-financial-literacy", storage, "student-1");
  assert.equal(enrolled, true);

  const afterEnrollment = getAcademyState(storage, "student-1");
  assert.ok(afterEnrollment.enrolledCourseIds.includes("intro-financial-literacy"));

  const completed = markCourseComplete("intro-financial-literacy", storage, "student-1");
  assert.equal(completed, true);

  const state = getAcademyState(storage, "student-1");
  assert.ok(state.completedCourseIds.includes("intro-financial-literacy"));
  assert.ok(getCertificateRecords(storage, "student-1").some((record) => record.courseId === "intro-financial-literacy"));
});
