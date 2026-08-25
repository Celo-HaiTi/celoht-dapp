"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, ShieldCheck } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useAccount } from "wagmi";
import { courses } from "@/lib/data/courses";

const extraCourses = [
	{ id: "digital-payments", title: "Digital payments", summary: "Make everyday payments with clarity and confidence.", modules: ["Payment basics", "Fees and confirmation", "Keeping records"] },
	{ id: "web3-safety", title: "Web3 safety", summary: "Protect your wallet, identity, and assets online.", modules: ["Scam signals", "Safe approvals", "Getting help"] },
];

export default function LearnPage() {
	const { address } = useAccount();
	const completed = useSyncExternalStore(subscribeProgress, () => readProgress(address), () => []);
	const catalog = [...courses, ...extraCourses];
	const completedCount = catalog.filter((course) => completed.includes(course.id)).length;

	return <div className="app-shell min-h-[calc(100dvh-64px)] px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:py-12"><div className="mx-auto max-w-5xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">CeloHT Academy</p><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">Learn. Practice. Understand.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-parchment-100/65">Short, practical lessons for using digital value responsibly on Celo.</p><div className="mt-8 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-4"><BookOpenCheck className="text-gold-300" size={22} aria-hidden="true" /><div className="flex-1"><div className="flex justify-between gap-4 text-sm"><span className="font-semibold text-white">Your progress</span><span className="font-mono text-parchment-100/60">{completedCount} / {catalog.length}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${catalog.length ? completedCount / catalog.length * 100 : 0}%` }} /></div></div></div><div className="mt-8 grid gap-4 sm:grid-cols-2">{catalog.map((course, index) => { const done = completed.includes(course.id); return <Link key={course.id} href={`/learn/${course.id}`} className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:-translate-y-0.5 hover:border-gold-500/50"><div className="flex items-start justify-between"><span className="font-mono text-xs text-gold-300">{String(index + 1).padStart(2, "0")}</span>{done && <ShieldCheck size={18} className="text-emerald-300" aria-label="Completed" />}</div><h2 className="mt-8 font-display text-xl font-semibold text-white">{course.title}</h2><p className="mt-2 text-sm leading-6 text-parchment-100/60">{course.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">{done ? "Review lesson" : "Start lesson"}<ArrowRight size={15} aria-hidden="true" /></span></Link>; })}</div></div></div>;
}

function progressKey(address?: string) {
		return `celoht-academy-progress:${address?.toLowerCase() ?? "guest"}`;
}

function readProgress(address?: string): string[] {
	try { return JSON.parse(localStorage.getItem(progressKey(address)) ?? "[]") as string[]; } catch { return []; }
}

function subscribeProgress(onChange: () => void) {
	window.addEventListener("storage", onChange);
	window.addEventListener("celoht-progress", onChange);
	return () => { window.removeEventListener("storage", onChange); window.removeEventListener("celoht-progress", onChange); };
}