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
    const lesson = await supabase.from("lessons").select("id,course_id").eq("id", body.lessonId).maybeSingle();
    if (lesson.error) return jsonError("Unable to verify lesson", 500);
    if (!lesson.data) return jsonError("Lesson not found", 404);
    const course = await supabase.from("courses").select("published").eq("id", lesson.data.course_id).maybeSingle();
    if (course.error) return jsonError("Unable to verify course", 500);
    if (!course.data?.published) return jsonError("Published course not found", 404);
    const enrollment = await supabase.from("enrollments").select("id").eq("course_id", lesson.data.course_id).eq("learner_wallet", session.walletAddress).maybeSingle();
    if (enrollment.error) return jsonError("Unable to verify enrollment", 500);
    if (!enrollment.data) return jsonError("Enroll in this course before recording progress", 403);
    const { error } = await supabase.from("lesson_progress").upsert({ lesson_id: body.lessonId, learner_wallet: session.walletAddress, completed_at: new Date().toISOString() }, { onConflict: "lesson_id,learner_wallet" });
    if (error) return jsonError("Unable to record lesson completion", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "lesson_completed", entity_type: "lesson", entity_id: body.lessonId });
    return Response.json({ completed: true });
  }

  if (body.courseId && body.action === "quiz") {
    const course = await supabase.from("courses").select("published").eq("id", body.courseId).maybeSingle();
    if (course.error) return jsonError("Unable to verify course", 500);
    if (!course.data?.published) return jsonError("Published course not found", 404);
    const enrollment = await supabase.from("enrollments").select("id").eq("course_id", body.courseId).eq("learner_wallet", session.walletAddress).maybeSingle();
    if (enrollment.error) return jsonError("Unable to verify enrollment", 500);
    if (!enrollment.data) return jsonError("Enroll in this course before taking the assessment", 403);
    if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) return jsonError("Answers are required", 400);
    const quiz = await supabase.from("quizzes").select("id,passing_score").eq("course_id", body.courseId).maybeSingle();
    if (quiz.error) return jsonError("Unable to load assessment", 500);
    if (!quiz.data) return jsonError("Assessment not found", 404);
    const result = await supabase.from("quiz_questions").select("id,options,correct_option").eq("quiz_id", quiz.data.id);
    if (result.error) return jsonError("Unable to load assessment questions", 500);
    const questions = result.data ?? [];
    if (questions.length === 0) return jsonError("Assessment has no questions", 400);

    const submittedAnswers = body.answers as Record<string, unknown>;
    if (Object.keys(submittedAnswers).length !== questions.length) return jsonError("Answer every question exactly once", 400);
    const normalizedAnswers: Record<string, number> = {};
    let correctAnswers = 0;
    for (const question of questions) {
      const answer = submittedAnswers[question.id];
      const options = Array.isArray(question.options) ? question.options : [];
      if (!Number.isInteger(answer) || Number(answer) < 0 || Number(answer) >= options.length) return jsonError("Invalid answer selection", 400);
      normalizedAnswers[question.id] = Number(answer);
      if (Number(answer) === question.correct_option) correctAnswers += 1;
    }

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= quiz.data.passing_score;
    const { error } = await supabase.from("quiz_attempts").insert({ course_id: body.courseId, learner_wallet: session.walletAddress, score, passed, answers: normalizedAnswers });
    if (error) return jsonError("Unable to record quiz attempt", 500);
    return Response.json({ passed, score, passingScore: quiz.data.passing_score });
  }

  if (body.courseId && body.action === "certificate") {
    const course = await supabase.from("courses").select("published").eq("id", body.courseId).maybeSingle();
    if (course.error) return jsonError("Unable to verify course", 500);
    if (!course.data?.published) return jsonError("Published course not found", 404);
    const enrollment = await supabase.from("enrollments").select("id").eq("course_id", body.courseId).eq("learner_wallet", session.walletAddress).maybeSingle();
    if (enrollment.error) return jsonError("Unable to verify enrollment", 500);
    if (!enrollment.data) return jsonError("Enroll in this course before requesting a certificate", 403);
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
    const course = await supabase.from("courses").select("published").eq("id", body.courseId).maybeSingle();
    if (course.error) return jsonError("Unable to verify course", 500);
    if (!course.data?.published) return jsonError("Published course not found", 404);
    const { error } = await supabase.from("enrollments").upsert({ course_id: body.courseId, learner_wallet: session.walletAddress }, { onConflict: "course_id,learner_wallet" });
    if (error) return jsonError("Unable to enroll", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "course_enrolled", entity_type: "course", entity_id: body.courseId });
    return Response.json({ enrolled: true });
  }
  return jsonError("Unsupported education action", 400);
}
