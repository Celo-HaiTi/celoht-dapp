"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleHelp, PlayCircle } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { courses } from "@/lib/data/courses";

type Lesson = { title: string; summary: string; modules: string[] };
type KnowledgeCheck = { question: string; options: string[]; answer: number };

const extraLessons: Record<string, Lesson> = {
  "digital-payments": { title: "Digital payments", summary: "Make everyday payments with clarity and confidence.", modules: ["Payment basics", "Fees and confirmation", "Keeping records"] },
  "web3-safety": { title: "Web3 safety", summary: "Protect your wallet, identity, and assets online.", modules: ["Scam signals", "Safe approvals", "Getting help"] },
};

const checks: Record<string, KnowledgeCheck> = {
  "financial-literacy-101": { question: "What is the safest starting point for a budget?", options: ["Track income and essential expenses", "Borrow as much as possible", "Ignore unexpected costs"], answer: 0 },
  "blockchain-web3-fundamentals": { question: "Which key should remain secret?", options: ["Your public address", "Your private key", "A transaction hash"], answer: 1 },
  "hands-on-valora-usdm": { question: "What should you never share with support?", options: ["Your public address", "A transaction hash", "Your recovery phrase"], answer: 2 },
  "crypto-risk-awareness": { question: "What is a useful response to an urgent investment message?", options: ["Pause and verify through an official channel", "Send funds immediately", "Share your recovery phrase"], answer: 0 },
  "digital-payments": { question: "When is a payment complete on-chain?", options: ["When a message says sent", "After the transaction is confirmed", "When a form is submitted"], answer: 1 },
  "web3-safety": { question: "What does a wallet approval allow?", options: ["A contract to use the approved token amount", "Anyone to know your private key", "A guaranteed refund"], answer: 0 },
};

export default function CoursePageClient({ courseId }: { courseId: string }) {
  const course = courses.find((item) => item.id === courseId) ?? extraLessons[courseId];
  const progress = useSyncExternalStore(subscribeProgress, readProgress, () => []);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [practice, setPractice] = useState(false);
  const check = checks[courseId];

  if (!course) return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-3xl font-semibold text-white">Lesson not found</h1><Link href="/learn" className="mt-5 inline-flex text-gold-300">Back to Academy</Link></div>;

  const isComplete = progress.includes(courseId);
  const quizStep = course.modules.length;

  function completeLesson() {
    const saved = new Set(readProgress());
    saved.add(courseId);
    localStorage.setItem("celoht-academy-progress", JSON.stringify([...saved]));
    window.dispatchEvent(new Event("celoht-progress"));
  }

  return <div className="app-shell min-h-[calc(100dvh-64px)] px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:py-12"><article className="mx-auto max-w-3xl"><Link href="/learn" className="inline-flex items-center gap-2 text-sm text-parchment-100/60 hover:text-white"><ArrowLeft size={16} aria-hidden="true" /> Academy</Link><p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Lesson</p><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">{course.title}</h1><p className="mt-4 text-base leading-7 text-parchment-100/65">{course.summary}</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold text-white">Lesson path</h2><span className="font-mono text-xs text-gold-300">{Math.min(activeStep + 1, course.modules.length + 1)} / {course.modules.length + 1}</span></div><ol className="mt-5 space-y-3">{course.modules.map((module, index) => <li key={module} className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${index <= activeStep ? "border-gold-500/40 text-white" : "border-white/10 text-parchment-100/55"}`}><span className="font-mono text-xs text-gold-300">{index + 1}</span>{module}{index < activeStep && <CheckCircle2 size={16} className="ml-auto text-emerald-300" aria-label="Step complete" />}</li>)}<li className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${activeStep >= quizStep ? "border-gold-500/40 text-white" : "border-white/10 text-parchment-100/55"}`}><CircleHelp size={16} className="text-gold-300" aria-hidden="true" />Knowledge check</li></ol></div><div className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100"><button type="button" className="flex w-full items-center gap-3 text-left font-semibold" onClick={() => setPractice((value) => !value)}><PlayCircle size={18} aria-hidden="true" />Practice Mode <span className="ml-auto text-xs font-normal">{practice ? "On" : "Off"}</span></button>{practice && <p className="mt-3 text-cyan-100/75">Simulation only: imagine selecting Celo, checking the recipient address, and waiting for confirmation. No wallet opens and no funds move.</p>}</div>{activeStep < quizStep ? <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">Step {activeStep + 1}</p><h2 className="mt-3 font-display text-2xl font-semibold text-white">{course.modules[activeStep]}</h2><p className="mt-3 text-sm leading-6 text-parchment-100/65">Read this step, relate it to your own experience, and continue when it makes sense. This learning path never requests your secret phrase.</p><button type="button" onClick={() => setActiveStep((step) => step + 1)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-navy-950 hover:bg-gold-300">Continue <PlayCircle size={17} aria-hidden="true" /></button></div> : <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">Knowledge check</p><h2 className="mt-3 font-display text-2xl font-semibold text-white">{check?.question ?? "What is one idea you will remember?"}</h2>{check ? <div className="mt-5 space-y-2">{check.options.map((option, index) => <button key={option} type="button" onClick={() => setSelectedAnswer(index)} className={`block w-full rounded-lg border px-4 py-3 text-left text-sm ${selectedAnswer === index ? index === check.answer ? "border-emerald-400 bg-emerald-400/10 text-emerald-100" : "border-red-400 bg-red-400/10 text-red-100" : "border-white/10 text-parchment-100/75 hover:border-gold-400"}`}>{option}</button>)}</div> : null}{selectedAnswer !== undefined && check && <p role="status" className="mt-4 text-sm text-parchment-100/75">{selectedAnswer === check.answer ? "Correct. You can complete this lesson." : "Not quite. Review the lesson path and try again."}</p>}<button type="button" onClick={completeLesson} disabled={Boolean(check && selectedAnswer !== check.answer)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-navy-950 enabled:hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50">{isComplete && <CheckCircle2 size={17} aria-hidden="true" />}{isComplete ? "Lesson completed" : "Complete lesson"}</button></div>}<p className="mt-5 text-xs text-parchment-100/45">Progress is stored locally on this device. No blockchain transaction is created by learning.</p></article></div>;
}

function readProgress(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("celoht-academy-progress") ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function subscribeProgress(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("celoht-progress", onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener("celoht-progress", onChange); };
}
