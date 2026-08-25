"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleHelp } from "lucide-react";
import { useSyncExternalStore, useState } from "react";
import { courses } from "@/lib/data/courses";

const extraLessons: Record<string, { title: string; summary: string; modules: string[] }> = {
  "digital-payments": { title: "Digital payments", summary: "Make everyday payments with clarity and confidence.", modules: ["Payment basics", "Fees and confirmation", "Keeping records"] },
  "web3-safety": { title: "Web3 safety", summary: "Protect your wallet, identity, and assets online.", modules: ["Scam signals", "Safe approvals", "Getting help"] },
};

export default function CoursePageClient({ courseId }: { courseId: string }) {
  const course = courses.find((item) => item.id === courseId) ?? extraLessons[courseId];
  const storedProgress = useSyncExternalStore(subscribeProgress, readProgress, () => []);
  const [done, setDone] = useState(storedProgress.includes(courseId));

  if (!course) return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-3xl font-semibold text-white">Lesson not found</h1><Link href="/learn" className="mt-5 inline-flex text-gold-300">Back to Academy</Link></div>;

  function completeLesson() {
    const saved = new Set<string>();
    try { (JSON.parse(localStorage.getItem("celoht-academy-progress") ?? "[]") as string[]).forEach((id) => saved.add(id)); } catch { /* empty progress */ }
    saved.add(courseId); localStorage.setItem("celoht-academy-progress", JSON.stringify([...saved])); window.dispatchEvent(new Event("celoht-progress")); setDone(true);
  }

  return <div className="app-shell min-h-[calc(100dvh-64px)] px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:py-12"><article className="mx-auto max-w-3xl"><Link href="/learn" className="inline-flex items-center gap-2 text-sm text-parchment-100/60 hover:text-white"><ArrowLeft size={16} aria-hidden="true" /> Academy</Link><p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Lesson</p><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">{course.title}</h1><p className="mt-4 text-base leading-7 text-parchment-100/65">{course.summary}</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-6"><h2 className="font-display text-xl font-semibold text-white">Lesson path</h2><ol className="mt-5 space-y-3">{course.modules.map((module, index) => <li key={module} className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 text-sm text-parchment-100/75"><span className="font-mono text-xs text-gold-300">{index + 1}</span>{module}</li>)}</ol></div><div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100"><CircleHelp size={18} className="mt-0.5 shrink-0" aria-hidden="true" />Progress is stored locally on this device until Academy storage is connected.</div><button type="button" onClick={completeLesson} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-navy-950 hover:bg-gold-300">{done && <CheckCircle2 size={17} aria-hidden="true" />}{done ? "Lesson completed" : "Mark lesson complete"}</button></article></div>;
}

function readProgress(): string[] {
  try { return JSON.parse(localStorage.getItem("celoht-academy-progress") ?? "[]") as string[]; } catch { return []; }
}

function subscribeProgress(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("celoht-progress", onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener("celoht-progress", onChange); };
}