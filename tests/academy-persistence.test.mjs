import test from "node:test";
import assert from "node:assert/strict";
import {
  createMemoryStorage,
  enrollCourse,
  getAcademyState,
  getCertificateRecords,
  markCourseComplete,
} from "../lib/academy/state.ts";
import { courses } from "../courses.ts";

test("academy state can enroll, track completion, and issue certificate records", () => {
  const targetCourse = courses.find((course) => course.schoolId === "financial-literacy") ?? courses[0];
  const storage = createMemoryStorage();
  const enrolled = enrollCourse(targetCourse.id, storage, "student-1");
  assert.equal(enrolled, true);

  const afterEnrollment = getAcademyState(storage, "student-1");
  assert.ok(afterEnrollment.enrolledCourseIds.includes(targetCourse.id));

  const completed = markCourseComplete(targetCourse.id, storage, "student-1");
  assert.equal(completed, true);

  const state = getAcademyState(storage, "student-1");
  assert.ok(state.completedCourseIds.includes(targetCourse.id));
  assert.ok(getCertificateRecords(storage, "student-1").some((record) => record.courseId === targetCourse.id));
});
