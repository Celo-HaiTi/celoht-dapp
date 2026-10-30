import { randomBytes } from "node:crypto";
import { getPilotSession, getPilotSupabase, jsonError } from "@/lib/server/pilot";

export async function GET(request: Request) {
  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search")?.trim();
  let query = supabase.from("courses").select("id,slug,title,summary,category,language,level,passing_score,published,lessons(id,position,title)").eq("published", true).order("title");
  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query.limit(100);
  if (error) return jsonError("Unable to load courses", 500);
  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  const session = await getPilotSession();
  if (!session) return jsonError("Authentication required", 401);
  const body = await request.json().catch(() => null) as { courseId?: string; lessonId?: string; action?: string; score?: number; answers?: unknown } | null;
  if (!body?.courseId && !body?.lessonId) return jsonError("Course or lesson required", 400);
  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);

  if (body.lessonId && body.action === "complete") {
    const { error } = await supabase.from("lesson_progress").upsert({ lesson_id: body.lessonId, learner_wallet: session.walletAddress, completed_at: new Date().toISOString() }, { onConflict: "lesson_id,learner_wallet" });
    if (error) return jsonError("Unable to record lesson completion", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "lesson_completed", entity_type: "lesson", entity_id: body.lessonId });
    return Response.json({ completed: true });
  }

  if (body.courseId && body.action === "quiz") {
    const score = Number(body.score);
    if (!Number.isInteger(score) || score < 0 || score > 100) return jsonError("Score must be between 0 and 100", 400);
    const course = await supabase.from("courses").select("passing_score").eq("id", body.courseId).single();
    if (course.error || !course.data) return jsonError("Course not found", 404);
    const passed = score >= course.data.passing_score;
    const { error } = await supabase.from("quiz_attempts").insert({ course_id: body.courseId, learner_wallet: session.walletAddress, score, passed, answers: body.answers ?? {} });
    if (error) return jsonError("Unable to record quiz attempt", 500);
    return Response.json({ passed, score, passingScore: course.data.passing_score });
  }

  if (body.courseId && body.action === "certificate") {
    const lessons = await supabase.from("lessons").select("id").eq("course_id", body.courseId);
    if (lessons.error) return jsonError("Unable to verify course lessons", 500);
    const lessonIds = lessons.data?.map((lesson) => lesson.id) ?? [];
    if (lessonIds.length === 0) return jsonError("Course has no lessons", 400);
    const progress = await supabase.from("lesson_progress").select("lesson_id").eq("learner_wallet", session.walletAddress).in("lesson_id", lessonIds).not("completed_at", "is", null);
    if (progress.error) return jsonError("Unable to verify lesson completion", 500);
    if ((progress.data?.length ?? 0) !== lessonIds.length) return jsonError("Complete every lesson before requesting a certificate", 400);
    const attempt = await supabase.from("quiz_attempts").select("passed").eq("course_id", body.courseId).eq("learner_wallet", session.walletAddress).eq("passed", true).order("created_at", { ascending: false }).limit(1);
    if (attempt.error) return jsonError("Unable to verify assessment", 500);
    if (!attempt.data?.length) return jsonError("A passing quiz attempt is required", 400);
    const identifier = `CELOHT-${randomBytes(6).toString("hex").toUpperCase()}`;
    const issued = await supabase.from("certificates").upsert({ certificate_identifier: identifier, course_id: body.courseId, learner_wallet: session.walletAddress }, { onConflict: "course_id,learner_wallet" }).select("*").single();
    if (issued.error) return jsonError("Unable to issue certificate", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "certificate_issued", entity_type: "certificate", entity_id: issued.data.id, metadata: { courseId: body.courseId, certificateIdentifier: issued.data.certificate_identifier } });
    return Response.json(issued.data);
  }

  if (body.courseId && body.action === "enroll") {
    const { error } = await supabase.from("enrollments").upsert({ course_id: body.courseId, learner_wallet: session.walletAddress }, { onConflict: "course_id,learner_wallet" });
    if (error) return jsonError("Unable to enroll", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "course_enrolled", entity_type: "course", entity_id: body.courseId });
    return Response.json({ enrolled: true });
  }
  return jsonError("Unsupported education action", 400);
}
