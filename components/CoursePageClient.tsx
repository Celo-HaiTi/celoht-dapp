"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleHelp, Lightbulb, PlayCircle } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";
import { courses } from "@/lib/data/courses";
import { getAcademyState, markCourseComplete } from "@/lib/academy/state";
import { buildLessonBlueprint, type LessonQuestion } from "@/lib/academy/lessons";
import { isBackendConfigured, saveBackendProgress } from "@/lib/backend";
import { useI18n } from "@/lib/i18n/context";

type LessonRecord = { id: string; title: string; summary: string };

const extraLessons: Record<string, LessonRecord> = {
  "digital-payments": {
    id: "digital-payments",
    title: "Digital payments",
    summary: "Understand payment rails, transaction records, and risk-aware approval decisions.",
  },
  "web3-safety": {
    id: "web3-safety",
    title: "Web3 safety",
    summary: "Protect your wallet, data, and approvals using safe digital practices.",
  },
};

const progressCache = new Map<string, { raw: string; value: string[] }>();

export default function CoursePageClient({ courseId }: { courseId: string }) {
  const { language } = useI18n();
  const course = courses.find((item) => item.id === courseId) ?? extraLessons[courseId];
  const { address } = useAccount();
  const progress = useSyncExternalStore(subscribeProgress, () => readProgress(address), () => []);
  const lesson = useMemo(() => buildLessonBlueprint(course ?? {}, language), [course, language]);

  const [activeStage, setActiveStage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [results, setResults] = useState<Record<string, { correct: boolean; feedback: string }>>({});
  const [statusMessage, setStatusMessage] = useState<string>("");

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-semibold text-white">Lesson not found</h1>
        <Link href="/learn" className="mt-5 inline-flex text-gold-300">
          Back to Academy
        </Link>
      </div>
    );
  }

  const allQuestions = lesson.stages.flatMap((stage) => stage.questions);
  const correctCount = allQuestions.filter((question) => results[question.id]?.correct).length;
  const score = allQuestions.length > 0 ? Math.round((correctCount / allQuestions.length) * 100) : 0;
  const answeredCount = allQuestions.filter((question) => question.id in answers).length;
  const isComplete = progress.includes(courseId);
  const activeStageQuestions = lesson.stages[activeStage]?.questions ?? [];
  const stageCompleted = activeStageQuestions.length === 0 || activeStageQuestions.every((question) => results[question.id]?.correct);
  const canSubmitFinal = allQuestions.length > 0 && answeredCount === allQuestions.length && score >= lesson.passingScore;

  function handleAnswer(question: LessonQuestion, value: string | number | boolean) {
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  }

  function evaluateAnswer(question: LessonQuestion, value: string | number | boolean) {
    if (question.type === "number") {
      const isCorrect = Number(value) === Number(question.answer);
      return {
        correct: isCorrect,
        feedback: isCorrect ? "Correct. " + question.explanation : `Incorrect. ${question.explanation}`,
      };
    }

    if (question.type === "true-false") {
      const isCorrect = String(value).toLowerCase() === String(question.answer).toLowerCase();
      return {
        correct: isCorrect,
        feedback: isCorrect ? "Correct. " + question.explanation : `Incorrect. ${question.explanation}`,
      };
    }

    if (question.type === "short-answer") {
      const expected = String(question.answer).trim().toLowerCase();
      const provided = String(value).trim().toLowerCase();
      const isCorrect = expected.length > 0 && (provided.includes(expected) || expected.includes(provided));
      return {
        correct: isCorrect,
        feedback: isCorrect ? "Correct. " + question.explanation : `Review the lesson material and try again. ${question.explanation}`,
      };
    }

    const isCorrect = String(value) === String(question.answer);
    return {
      correct: isCorrect,
      feedback: isCorrect ? "Correct. " + question.explanation : `Incorrect. ${question.explanation}`,
    };
  }

  function submitAnswer(question: LessonQuestion) {
    const value = answers[question.id];
    if (value === undefined) {
      setStatusMessage("Answer the question before submitting.");
      return;
    }

    const result = evaluateAnswer(question, value);
    setResults((previous) => ({ ...previous, [question.id]: result }));
    setStatusMessage(result.correct ? "Answer recorded. Continue to the next section when ready." : result.feedback);
  }

  async function completeLesson() {
    if (!canSubmitFinal) {
      setStatusMessage("Complete all required assessment items and earn at least 80/100 before the course is marked complete.");
      return;
    }

    try {
      if (isBackendConfigured()) {
        await saveBackendProgress(courseId, true).catch(() => undefined);
      }
      markCourseComplete(courseId, undefined, address?.toLowerCase() ?? "guest");
      window.dispatchEvent(new Event("celoht-progress"));
      setStatusMessage("Assessment submitted successfully. The next lesson is now unlocked.");
    } catch {
      markCourseComplete(courseId, undefined, address?.toLowerCase() ?? "guest");
      window.dispatchEvent(new Event("celoht-progress"));
      setStatusMessage("Assessment submitted locally because the backend is not configured for this learner session.");
    }
  }

  const stage = lesson.stages[activeStage];

  return (
    <div className="app-shell min-h-[calc(100dvh-64px)] px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:py-12">
      <article className="mx-auto max-w-4xl">
        <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-parchment-100/60 hover:text-white">
          <ArrowLeft size={16} aria-hidden="true" /> Academy
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Lesson</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">{lesson.title}</h1>
        <p className="mt-4 text-base leading-7 text-parchment-100/65">{lesson.summary}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-white">Lesson path</h2>
            <span className="font-mono text-xs text-gold-300">
              {Math.min(activeStage + 1, lesson.stages.length)} / {lesson.stages.length}
            </span>
          </div>

          <ol className="mt-5 space-y-3">
            {lesson.stages.map((item, index) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                  index <= activeStage ? "border-gold-500/40 text-white" : "border-white/10 text-parchment-100/55"
                }`}
              >
                <span className="font-mono text-xs text-gold-300">{index + 1}</span>
                {item.title}
                {index < activeStage && <CheckCircle2 size={16} className="ml-auto text-emerald-300" aria-label="Step complete" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">
          <button type="button" className="flex w-full items-center gap-3 text-left font-semibold" onClick={() => setActiveStage((value) => Math.min(value + 1, lesson.stages.length - 1))}>
            <PlayCircle size={18} aria-hidden="true" /> Practice mode
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-navy-950/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-kicker">Stage {activeStage + 1}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">{stage.title}</h2>
            </div>
            <div className="rounded-full border border-gold-400/30 bg-gold-400/8 px-3 py-1 text-xs font-medium text-gold-100">
              {score}/100 assessment score
            </div>
          </div>

          <div className="mt-6 space-y-5 text-parchment-100/80">
            {stage.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7">
                {paragraph}
              </p>
            ))}

            {stage.bullets && (
              <ul className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-parchment-100/75">
                {stage.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gold-300" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {stage.table && (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/[0.04] text-gold-200">
                    <tr>
                      {stage.table.headers.map((header) => (
                        <th key={header} className="px-4 py-3 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stage.table.rows.map((row, rowIndex) => (
                      <tr key={`${stage.id}-row-${rowIndex}`} className="border-t border-white/10">
                        {row.map((cell, cellIndex) => (
                          <td key={`${stage.id}-cell-${cellIndex}`} className="px-4 py-3 text-parchment-100/75">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {stage.example && (
              <div className="rounded-xl border border-gold-400/20 bg-gold-400/6 p-4">
                <p className="font-display text-lg font-semibold text-white">{stage.example.title}</p>
                {stage.example.content.map((item) => (
                  <p key={item} className="mt-3 text-sm leading-6 text-parchment-100/75">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>

          {activeStageQuestions.length > 0 && (
            <div className="mt-8 space-y-6 border-t border-white/10 pt-6">
              {activeStageQuestions.map((question) => {
                const selectedValue = answers[question.id];
                const result = results[question.id];

                return (
                  <div key={question.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-medium text-white">{question.prompt}</p>
                      {result && (
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${result.correct ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"}`}>
                          {result.correct ? "Correct" : "Needs review"}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      {question.type === "multiple-choice" && question.options?.map((option, optionIndex) => {
                        const optionId = `${question.id}-${optionIndex}`;
                        return (
                          <label key={optionId} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-parchment-100/70">
                            <input
                              type="radio"
                              name={question.id}
                              checked={selectedValue === option}
                              onChange={() => handleAnswer(question, option)}
                              className="h-4 w-4 accent-gold-300"
                            />
                            <span>{option}</span>
                          </label>
                        );
                      })}

                      {question.type === "true-false" && (
                        <div className="flex flex-wrap gap-3">
                          {[true, false].map((option) => (
                            <label key={String(option)} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-parchment-100/70">
                              <input
                                type="radio"
                                name={question.id}
                                checked={selectedValue === option}
                                onChange={() => handleAnswer(question, option)}
                                className="h-4 w-4 accent-gold-300"
                              />
                              <span>{option ? "True" : "False"}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {(question.type === "number" || question.type === "short-answer") && (
                        <input
                          type={question.type === "number" ? "number" : "text"}
                          value={typeof selectedValue === "number" || typeof selectedValue === "string" ? selectedValue : ""}
                          onChange={(event) => handleAnswer(question, question.type === "number" ? Number(event.target.value) : event.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-navy-950 px-4 py-3 text-sm text-white placeholder:text-parchment-100/35 focus:border-gold-400/70 focus:outline-none"
                          placeholder={question.type === "number" ? "Enter a number" : "Type your answer"}
                        />
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => submitAnswer(question)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gold-400/30 bg-gold-400/12 px-3 py-2 text-sm font-medium text-gold-100 hover:bg-gold-400/20"
                      >
                        <CircleHelp size={16} aria-hidden="true" /> Check answer
                      </button>

                      {result && <p className="text-sm text-parchment-100/75">{result.feedback}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-parchment-100/60">
              {statusMessage || "Complete each section and answer the required questions before moving to the next stage."}
            </div>

            <div className="flex gap-3">
              {activeStage > 0 && (
                <button type="button" onClick={() => setActiveStage((value) => value - 1)} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white">
                  Previous
                </button>
              )}

              {activeStage < lesson.stages.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!stageCompleted) {
                      setStatusMessage("Answer the questions in this stage correctly before continuing.");
                      return;
                    }
                    setActiveStage((value) => value + 1);
                  }}
                  disabled={!stageCompleted}
                  className="rounded-lg border border-gold-400/30 bg-gold-400/12 px-4 py-2 text-sm font-medium text-gold-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={completeLesson}
                  disabled={!canSubmitFinal}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/12 px-4 py-2 text-sm font-medium text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isComplete ? "Completed" : "Submit final assessment"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-parchment-100/65">
          <div className="flex items-start gap-3">
            <Lightbulb size={17} className="mt-0.5 text-gold-300" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Progress and persistence</p>
              <p className="mt-1">
                Progress is saved locally on this device when no authenticated backend session is active. If the CeloHT backend is configured and the learner is authenticated, completion is synced there as well.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function progressKey(address?: string) {
  return `celoht-academy-progress:${address?.toLowerCase() ?? "guest"}`;
}

function readProgress(address?: string): string[] {
  const studentId = address?.toLowerCase() ?? "guest";
  return getAcademyState(undefined, studentId).completedCourseIds;
}

function subscribeProgress(onChange: () => void) {
  const notify = () => {
    progressCache.clear();
    onChange();
  };

  window.addEventListener("storage", notify);
  window.addEventListener("celoht-progress", notify);

  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("celoht-progress", notify);
  };
}
