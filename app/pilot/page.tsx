"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type Session = { walletAddress: string; role: string };
type Course = { id: string; slug: string; title: string; summary: string; category: string; language: string; level: string; passing_score: number; lessons?: { id: string; position: number; title: string }[] };

async function api(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, headers: { "content-type": "application/json", ...init?.headers }, credentials: "include" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message ?? `Request failed (${response.status})`);
  return body;
}

export default function PilotPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<string>();

  useEffect(() => { void api("/api/pilot/auth/me").then(setSession).catch(() => setSession(null)); void api("/api/pilot/education").then(setCourses).catch(() => setCourses([])); }, []);

  async function login() {
    if (!address || !isConnected) return;
    setAuthError(undefined);
    try {
      const nonce = await api("/api/pilot/auth/nonce", { method: "POST", body: JSON.stringify({ walletAddress: address }) });
      const signature = await signMessageAsync({ message: nonce.message });
      const result = await api("/api/pilot/auth/verify", { method: "POST", body: JSON.stringify({ walletAddress: address, signature }) });
      setSession(result);
    } catch (error) { setAuthError(error instanceof Error ? error.message : "Login failed"); }
  }

  async function enroll(courseId: string) {
    try { await api("/api/pilot/education", { method: "POST", body: JSON.stringify({ action: "enroll", courseId }) }); setStatus("Enrolled. Progress is stored in the pilot database."); } catch (error) { setStatus(error instanceof Error ? error.message : "Enrollment failed"); }
  }

  async function completeLesson(lessonId: string) {
    try { await api("/api/pilot/education", { method: "POST", body: JSON.stringify({ action: "complete", lessonId }) }); setStatus("Lesson completion saved."); } catch (error) { setStatus(error instanceof Error ? error.message : "Unable to save progress"); }
  }

  async function submitAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/pilot/agents", { method: "POST", body: JSON.stringify({ action: "apply", fullName: form.get("fullName"), contact: form.get("contact"), location: form.get("location"), community: form.get("community") }) });
      setStatus("Agent application submitted for review. Identity verification is not assumed.");
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Application failed"); }
  }

  async function submitService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const serviceType = String(form.get("serviceType"));
    try {
      await api("/api/pilot/agents", { method: "POST", body: JSON.stringify({ action: "service", serviceType, customerReference: form.get("customerReference"), amount: form.get("amount") || undefined, notes: form.get("notes") }) });
      setStatus(serviceType.includes("simulation") ? "Simulated service record saved. No cash or blockchain transaction moved." : "Service record saved.");
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Service record failed"); }
  }

  async function submitPlanting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/pilot/reforestation", { method: "POST", body: JSON.stringify({ action: "submit", projectName: form.get("projectName"), location: form.get("location"), species: form.get("species"), treesPlanted: form.get("treesPlanted"), treesPlanned: form.get("treesPlanned") || 0, plantingDate: form.get("plantingDate"), responsibleGroup: form.get("responsibleGroup") }) });
      setStatus("Planting event submitted. It remains unverified and is excluded from verified impact.");
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Submission failed"); }
  }

  return <><PageHero eyebrow="Celo Sepolia · Pilot operations" title="Working pilot workspace" lead="Public Pages mode is available for browsing and wallet actions. Database-backed authentication and administration require a Next.js server deployment with configured Supabase secrets." />
    <Section><Card className="max-w-3xl"><CardHeader><CardTitle>Controlled pilot authentication</CardTitle></CardHeader><CardDescription>{session ? `Signed in as ${session.walletAddress.slice(0,8)}… · role: ${session.role}` : isConnected ? "Sign a nonce to create a pilot session." : "Connect a Celo Sepolia wallet first."}</CardDescription>{!session && isConnected && <Button className="mt-5" onClick={login}>Sign in with wallet</Button>}{authError && <p className="mt-3 text-sm text-red-300" role="alert">{authError}</p>}</Card></Section>
    {status && <Section><p className="text-sm text-cyan-200" role="status">{status}</p></Section>}
    <Section eyebrow="Education" title="Courses and progress"><div className="grid gap-4 lg:grid-cols-2">{courses.map((course) => <Card key={course.id}><CardHeader><CardTitle>{course.title}</CardTitle></CardHeader><CardDescription>{course.summary}</CardDescription><p className="mt-3 text-xs text-parchment-100/55">{course.category} · {course.language} · passing score {course.passing_score}%</p>{session && <><Button className="mt-4" onClick={() => enroll(course.id)}>Enroll</Button><div className="mt-3 flex flex-wrap gap-2">{course.lessons?.map((lesson) => <Button key={lesson.id} className="text-xs" onClick={() => completeLesson(lesson.id)}>Complete {lesson.position}: {lesson.title}</Button>)}</div></>}</Card>)}</div>{courses.length === 0 && <p className="text-sm text-parchment-100/55">No published database courses are available yet. Apply the migration and publish courses from an authorized backend/admin workflow.</p>}</Section>
    {session && <><Section eyebrow="Agent Network" title="Application"><Card className="max-w-2xl"><form className="space-y-3" onSubmit={submitAgent}><input name="fullName" required placeholder="Full name" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="contact" required placeholder="Email or phone" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="location" required placeholder="Location" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="community" required placeholder="Community" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><Button type="submit">Submit application</Button></form></Card></Section><Section eyebrow="Agent Network" title="Service record"><Card className="max-w-2xl"><form className="space-y-3" onSubmit={submitService}><select name="serviceType" className="w-full rounded-lg border border-white/10 bg-navy-950 p-3"><option value="cash_in_simulation">Simulated cash-in</option><option value="cash_out_simulation">Simulated cash-out</option><option value="wallet_onboarding">Wallet onboarding</option><option value="customer_support">Customer support</option><option value="other">Other</option></select><input name="customerReference" required placeholder="Customer/service reference" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="amount" type="number" min="0" step="0.000001" placeholder="Simulated amount (optional)" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><textarea name="notes" placeholder="Notes" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><Button type="submit">Save service record</Button></form><CardDescription className="mt-3">Cash-in/cash-out selections are explicitly simulations and create no blockchain transaction.</CardDescription></Card></Section><Section eyebrow="Reforestation" title="Register a planting event"><Card className="max-w-2xl"><form className="space-y-3" onSubmit={submitPlanting}><input name="projectName" required placeholder="Project name" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="location" required placeholder="Location" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="species" required placeholder="Tree species" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="treesPlanted" required type="number" min="0" placeholder="Trees planted" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="treesPlanned" type="number" min="0" placeholder="Trees planned" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="plantingDate" required type="date" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><input name="responsibleGroup" required placeholder="Responsible organization/community" className="w-full rounded-lg border border-white/10 bg-white/5 p-3"/><Button type="submit">Submit for verification</Button></form><CardDescription className="mt-3">Submitted records are not verified impact until an authorized reviewer verifies evidence.</CardDescription></Card></Section></>}
  </>;
}
