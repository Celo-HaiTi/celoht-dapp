import { courses } from "@/lib/data/courses";
import CoursePageClient from "@/components/CoursePageClient";

export function generateStaticParams() {
  return courses.map((course) => ({ course: course.id })).concat([{ course: "digital-payments" }, { course: "web3-safety" }]);
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  return <CoursePageClient courseId={(await params).course} />;
}