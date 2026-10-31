"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  BackendRequestError,
  getBackendAgentApplication,
  getBackendCourses,
  getBackendProfile,
  getBackendProgress,
  getBackendReforestation,
  getBackendTransactions,
  isBackendConfigured,
  requestWalletNonce,
  saveBackendProgress,
  submitBackendAgentApplication,
  verifyWalletSignature,
  type BackendAgentApplication,
  type BackendProgressRecord,
  type BackendReforestationProject,
  type BackendTransaction,
} from "@/lib/backend";

type Session = { walletAddress: string };
type Course = {
  id: string;
  title: string;
  summary: string;
  language?: string;
  level?: string;
  passing_score?: number;
  lessons?: { id: string; position: number; title: string }[];
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const body = init?.body ? JSON.parse(String(init.body)) as Record<string, unknown> : {};
  if (path === "/api/pilot/auth/me") return await getBackendProfile() as T;
  if (path === "/api/pilot/auth/nonce") return await requestWalletNonce(String(body.walletAddress) as `0x${string}`) as T;
  if (path === "/api/pilot/auth/verify") {
    if (typeof body.nonce !== "string") throw new Error("Wallet challenge is missing its nonce.");
    await verifyWalletSignature(String(body.walletAddress) as `0x${string}`, body.nonce, String(body.signature) as `0x${string}`);
    return await getBackendProfile() as T;
  }
  if (path === "/api/pilot/education" && !init?.method) {
    const courses = await getBackendCourses();
    return courses.map((course) => ({ id: course.id, title: course.title, summary: course.description })) as T;
  }
  if (path === "/api/pilot/education" && body.action === "complete" && typeof body.lessonId === "string") {
    return await saveBackendProgress(body.lessonId, true) as T;
  }
  if (path === "/api/pilot/education") throw new Error("The official backend does not currently support course enrollment or quizzes.");
  if (path === "/api/pilot/agents" && body.action === "apply") {
    const applicationData = { ...body };
    delete applicationData.action;
    return await submitBackendAgentApplication(applicationData) as T;
  }
  if (path === "/api/pilot/agents") throw new Error("The official backend does not currently expose agent service simulations.");
  if (path === "/api/pilot/reforestation" && !init?.method) return await getBackendReforestation() as T;
  if (path === "/api/pilot/reforestation") throw new Error("The official backend does not currently accept planting evidence submissions.");
  throw new Error("This pilot action is not supported by the official backend.");
}

export default function PilotPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<BackendProgressRecord[]>([]);
  const [agentApplication, setAgentApplication] = useState<BackendAgentApplication | null>(null);
  const [agentLoadError, setAgentLoadError] = useState<string>();
  const [projects, setProjects] = useState<BackendReforestationProject[]>([]);
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [status, setStatus] = useState<string>();
  const authenticated = Boolean(session && isConnected && address && session.walletAddress.toLowerCase() === address.toLowerCase());

  useEffect(() => {
    let active = true;
    if (!isBackendConfigured()) {
      return () => { active = false; };
    }
    void api<Course[]>("/api/pilot/education")
      .then((result) => { if (active) setCourses(result); })
      .catch((cause) => { if (active) setStatus(cause instanceof Error ? cause.message : "Unable to load courses."); });
    void api<BackendReforestationProject[]>("/api/pilot/reforestation")
      .then((result) => { if (active) setProjects(result); })
      .catch((cause) => { if (active) setStatus(cause instanceof Error ? cause.message : "Unable to load projects."); });
    if (address) void getBackendTransactions(address)
      .then((result) => { if (active) setTransactions(result); })
      .catch(() => { if (active) setTransactions([]); });
    if (address && isConnected) {
      void api<Session>("/api/pilot/auth/me")
        .then(async (profile) => {
          if (!active || profile.walletAddress.toLowerCase() !== address.toLowerCase()) return;
          setSession(profile);
          const [applicationResult, progressResult] = await Promise.allSettled([
            getBackendAgentApplication(),
            getBackendProgress(),
          ]);
          if (!active) return;
          if (applicationResult.status === "fulfilled") {
            setAgentApplication(applicationResult.value);
            setAgentLoadError(undefined);
          } else if (applicationResult.reason instanceof BackendRequestError && applicationResult.reason.status === 404) {
            setAgentApplication(null);
            setAgentLoadError(undefined);
          } else {
            setAgentLoadError(applicationResult.reason instanceof Error ? applicationResult.reason.message : "Unable to load agent application.");
          }
          if (progressResult.status === "fulfilled") setProgress(progressResult.value);
        })
        .catch(() => { if (active) setSession(null); });
    }
    return () => { active = false; };
  }, [address, isConnected]);

  async function login() {
    if (!address || !isConnected || chainId !== 11142220) {
      setAuthError("Connect a wallet on Celo Sepolia (11142220) before signing in.");
      return;
    }
    setAuthError(undefined);
    try {
      const nonce = await api<{ message: string; nonce: string }>("/api/pilot/auth/nonce", {
        method: "POST",
        body: JSON.stringify({ walletAddress: address }),
      });
      const signature = await signMessageAsync({ message: nonce.message });
      const result = await api<Session>("/api/pilot/auth/verify", {
        method: "POST",
        body: JSON.stringify({ walletAddress: address, nonce: nonce.nonce, signature }),
      });
      setSession(result);
      const [applicationResult, progressResult] = await Promise.allSettled([
        getBackendAgentApplication(),
        getBackendProgress(),
      ]);
      if (applicationResult.status === "fulfilled") {
        setAgentApplication(applicationResult.value);
        setAgentLoadError(undefined);
      } else if (applicationResult.reason instanceof BackendRequestError && applicationResult.reason.status === 404) {
        setAgentApplication(null);
        setAgentLoadError(undefined);
      } else {
        setAgentLoadError(applicationResult.reason instanceof Error ? applicationResult.reason.message : "Unable to load agent application.");
      }
      if (progressResult.status === "fulfilled") setProgress(progressResult.value);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function submitAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await api<unknown>("/api/pilot/agents", {
        method: "POST",
        body: JSON.stringify({
          action: "apply",
          fullName: form.get("fullName"),
          contact: form.get("contact"),
          location: form.get("location"),
          community: form.get("community"),
        }),
      });
      setStatus(
        "Agent application submitted for review. Identity verification is not assumed.",
      );
      setAgentApplication(await getBackendAgentApplication());
      formElement.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Application failed");
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Celo Sepolia · Pilot Center"
        title="Pilot operations"
        lead="This GitHub Pages app reads and writes through the official CeloHT backend. Records appear only when that service is configured and confirms the request."
      />
      <Section>
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Controlled pilot authentication</CardTitle>
          </CardHeader>
          <CardDescription>
            {!isBackendConfigured()
              ? "The official backend is not configured in this GitHub Pages build."
              : authenticated
              ? `Signed in with wallet ${session?.walletAddress.slice(0, 8)}…`
              : isConnected
                ? "Sign a nonce to create a pilot session."
                : "Connect a Celo Sepolia wallet first."}
          </CardDescription>
          {!authenticated && isConnected && (
            <Button className="mt-5" onClick={login} disabled={chainId !== 11142220}>
              Sign in securely
            </Button>
          )}
          {isConnected && chainId !== 11142220 ? <p className="mt-3 text-sm text-amber-200" role="alert">Switch to Celo Sepolia, chain ID 11142220.</p> : null}
          {authError && (
            <p className="mt-3 text-sm text-red-300" role="alert">
              {authError}
            </p>
          )}
        </Card>
      </Section>
      {status && (
        <Section>
          <p className="text-sm text-cyan-200" role="status">
            {status}
          </p>
        </Section>
      )}
      <Section eyebrow="Education" title="Published course catalog">
        <div className="grid gap-4 lg:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardDescription>{course.summary}</CardDescription>
              <p className="mt-3 text-xs text-parchment-100/55">Published course</p>
            </Card>
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-sm text-parchment-100/55">
            No published courses are available from the official backend.
          </p>
        )}
        <p className="mt-4 text-sm text-parchment-100/55">Lesson details, enrollment, and quizzes are not exposed by the current backend API, so this page does not claim course completion.</p>
        {session ? <p className="mt-2 text-xs text-parchment-100/45">Saved lesson progress records: {progress.length}</p> : null}
      </Section>
      {authenticated && (
        <>
          <Section eyebrow="Agent Network" title="Application">
            <Card className="max-w-2xl">
              {agentLoadError ? <CardDescription role="alert">Application status unavailable: {agentLoadError}</CardDescription> : agentApplication ? <CardDescription>Application on file. Off-chain review: {agentApplication.off_chain_kyc_status}. Registry: {agentApplication.on_chain_registry_status}. This status is supplied by the backend and is not inferred here.</CardDescription> : <form className="space-y-3" onSubmit={submitAgent}>
                <input
                  name="fullName"
                  required
                  placeholder="Full name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3"
                />
                <input
                  name="contact"
                  required
                  placeholder="Email or phone"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3"
                />
                <input
                  name="location"
                  required
                  placeholder="Location"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3"
                />
                <input
                  name="community"
                  required
                  placeholder="Community"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3"
                />
                <Button type="submit">Submit application</Button>
              </form>}
            </Card>
          </Section>
          <Section eyebrow="Agent Network" title="Service simulations">
            <p className="text-sm text-parchment-100/55">Cash-in/cash-out simulation endpoints are not available in the official backend. No service record is created here.</p>
          </Section>
          <Section eyebrow="Reforestation" title="Published projects and verified records">
            {projects.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader><CardTitle>{project.title}</CardTitle></CardHeader>
                    <CardDescription>{project.description || "No project description provided."}</CardDescription>
                    <p className="mt-3 text-sm text-parchment-100/60">Location: {project.location || "Not provided"}</p>
                    <p className="mt-2 text-sm text-parchment-100/60">Contribution records: {project.financialContributionCount} · Verified trees: {project.verifiedTreesPlanted}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-parchment-100/55">No published projects are available from the official backend.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/donations" className="text-sm font-semibold text-gold-300">Open Celo Sepolia contribution flow</Link>
              <p className="text-sm text-parchment-100/55">Planting submissions are unavailable until the backend exposes an evidence workflow.</p>
            </div>
          </Section>
          <Section eyebrow="Activity" title="Indexed wallet history">
            {transactions.length ? <div className="space-y-3">{transactions.map((transaction) => <Card key={transaction.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium text-white">{transaction.event_name}</p><a className="mt-1 block break-all font-mono text-xs text-parchment-100/50 underline" href={`https://celo-sepolia.blockscout.com/tx/${transaction.transaction_hash}`} target="_blank" rel="noreferrer">{transaction.transaction_hash}</a></div><span className="text-xs text-parchment-100/60">{transaction.confirmed ? "Confirmed" : "Unconfirmed"} · block {transaction.block_number}</span></div></Card>)}</div> : <p className="text-sm text-parchment-100/55">No indexed transactions were returned for this wallet.</p>}
          </Section>
        </>
      )}
    </>
  );
}
