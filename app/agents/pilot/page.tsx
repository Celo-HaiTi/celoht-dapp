"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AgentPilotPage() {
  const [applicationStatus, setApplicationStatus] = useState("Not started");
  const [serviceStatus, setServiceStatus] = useState<string>();

  function prepareApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const community = String(form.get("community") ?? "").trim();
    if (!fullName || !community) return;
    setApplicationStatus("Application prepared locally — not submitted to the backend");
    event.currentTarget.reset();
  }

  function runService(service: string) {
    setServiceStatus(`${service} prepared as a test simulation. No cash or blockchain transaction occurred.`);
  }

  return <div className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8"><Link href="/agents" className="inline-flex items-center gap-2 text-sm text-parchment-100/60"><ArrowLeft size={16} /> Agent Network</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">Public pilot mode</p><h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">Test the Agent workflow</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-100/60">Explore application and service steps without sending real money. Identity documents should be submitted only through a configured secure backend.</p>
    <div className="mt-7 grid gap-5 lg:grid-cols-2"><Card><CardHeader><UserRound size={18} /><CardTitle>Agent application preview</CardTitle></CardHeader><CardDescription>Preparing an application does not create a verified agent or submit personal information to a server.</CardDescription><form className="mt-5 space-y-3" onSubmit={prepareApplication}><input name="fullName" required placeholder="Full name" className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm"/><input name="community" required placeholder="Community or town" className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm"/><select name="location" className="w-full rounded-lg border border-white/10 bg-navy-950 p-3 text-sm"><option>Ouest</option><option>Artibonite</option><option>Nord</option><option>Nord-Est</option><option>Nippes</option><option>Centre</option><option>Sud</option><option>Sud-Est</option><option>Grand-Anse</option></select><Button type="submit">Prepare application</Button></form><p className="mt-4 flex items-center gap-2 text-sm text-gold-300" role="status">{applicationStatus !== "Not started" && <CheckCircle2 size={16} />}{applicationStatus}</p></Card><Card><CardHeader><CardTitle>Service simulation</CardTitle></CardHeader><CardDescription>Test service status without cash movement or blockchain settlement.</CardDescription><div className="mt-5 grid gap-3"><Button type="button" onClick={() => runService("Cash-in")}>Test cash-in</Button><Button type="button" onClick={() => runService("Cash-out")}>Test cash-out</Button><Button type="button" onClick={() => runService("Wallet onboarding")}>Test wallet onboarding</Button></div>{serviceStatus && <p className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-100" role="status">{serviceStatus}</p>}</Card></div>
  </div>;
}
