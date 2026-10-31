import { getPilotSession, getPilotSupabase, jsonError, requireAdmin } from "@/lib/server/pilot";

export async function GET() {
  const session = await getPilotSession();
  if (!session) return jsonError("Authentication required", 401);
  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);
  if (requireAdmin(session)) {
    const { data, error } = await supabase.from("agent_applications").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) return jsonError("Unable to load applications", 500);
    return Response.json(data ?? []);
  }
  const { data, error } = await supabase.from("agent_applications").select("*").eq("wallet_address", session.walletAddress).order("created_at", { ascending: false }).limit(20);
  if (error) return jsonError("Unable to load application", 500);
  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  const session = await getPilotSession();
  if (!session) return jsonError("Authentication required", 401);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.action) return jsonError("Action required", 400);
  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);

  if (body.action === "apply") {
    const fullName = String(body.fullName ?? "").trim();
    const contact = String(body.contact ?? "").trim();
    const location = String(body.location ?? "").trim();
    const community = String(body.community ?? "").trim();
    if (fullName.length < 2 || contact.length === 0 || location.length === 0 || community.length === 0) return jsonError("Name, contact, location, and community are required", 400);
    const identityDocumentUrl = typeof body.identityDocumentUrl === "string" ? body.identityDocumentUrl : null;
    const { data, error } = await supabase.from("agent_applications").insert({ wallet_address: session.walletAddress, full_name: fullName, contact, location, community, identity_document_url: identityDocumentUrl, status: "pending" }).select("*").single();
    if (error) return jsonError("Unable to submit application", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "agent_application_submitted", entity_type: "agent_application", entity_id: data.id });
    await supabase.from("profiles").update({ role: "agent_applicant" }).eq("wallet_address", session.walletAddress);
    return Response.json(data, { status: 201 });
  }

  if (body.action === "review") {
    if (!requireAdmin(session)) return jsonError("Administrator role required", 403);
    const applicationId = String(body.applicationId ?? "").trim();
    if (!applicationId) return jsonError("Application ID required", 400);
    const status = String(body.status ?? "");
    if (!["pending","under_review","approved","rejected","additional_information_required","suspended"].includes(status)) return jsonError("Invalid application status", 400);
    const application = await supabase.from("agent_applications").select("id,wallet_address").eq("id", applicationId).maybeSingle();
    if (application.error) return jsonError("Unable to load application", 500);
    if (!application.data) return jsonError("Application not found", 404);
    const { error } = await supabase.from("agent_applications").update({ status, reviewer_notes: typeof body.notes === "string" ? body.notes : null, reviewed_by: session.walletAddress, reviewed_at: new Date().toISOString() }).eq("id", applicationId);
    if (error) return jsonError("Unable to review application", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "agent_application_reviewed", entity_type: "agent_application", entity_id: applicationId, metadata: { status } });
    if (status !== "approved") {
      const otherApproved = await supabase.from("agent_applications").select("id").eq("wallet_address", application.data.wallet_address).eq("status", "approved").limit(1);
      if (otherApproved.error) return jsonError("Application reviewed, but agent role could not be checked", 500);
      if (!otherApproved.data?.length) {
        const { error: roleError } = await supabase.from("profiles").update({ role: "agent_applicant" }).eq("wallet_address", application.data.wallet_address).eq("role", "verified_agent");
        if (roleError) return jsonError("Application reviewed, but agent role could not be updated", 500);
      }
    }
    return Response.json({ reviewed: true });
  }

  if (body.action === "service") {
    const serviceType = String(body.serviceType ?? "customer_support");
    if (!["cash_in_simulation","cash_out_simulation","wallet_onboarding","customer_support","other"].includes(serviceType)) return jsonError("Invalid service type", 400);
    const simulated = serviceType === "cash_in_simulation" || serviceType === "cash_out_simulation";
    const profile = await supabase.from("profiles").select("role").eq("wallet_address", session.walletAddress).maybeSingle();
    if (profile.error) return jsonError("Unable to verify agent role", 500);
    const allowedRoles = simulated ? ["agent_applicant", "verified_agent"] : ["verified_agent"];
    if (!profile.data || !allowedRoles.includes(profile.data.role)) return jsonError("An agent application or verified agent role is required", 403);
    const rawAmount = body.amount === undefined || body.amount === null || String(body.amount).trim() === "" ? null : String(body.amount).trim();
    if (rawAmount !== null && (!/^(?:0|[1-9]\d{0,11})(?:\.\d{1,18})?$/.test(rawAmount) || Number(rawAmount) <= 0 || !Number.isFinite(Number(rawAmount)))) return jsonError("Amount must be a positive number with at most 18 decimal places", 400);
    if (!simulated && rawAmount !== null) return jsonError("Amounts are accepted only for cash simulations", 400);
    if (simulated && rawAmount !== null) {
      const simulationLimit = Number(process.env.PILOT_AGENT_MAX_SIMULATION_AMOUNT);
      if (!Number.isFinite(simulationLimit) || simulationLimit <= 0) return jsonError("Pilot simulation amount limit is not configured", 503);
      if (Number(rawAmount) > simulationLimit) return jsonError("Amount exceeds the configured pilot simulation limit", 400);
    }
    const { data, error } = await supabase.from("agent_services").insert({ agent_wallet: session.walletAddress, customer_reference: String(body.customerReference ?? "").trim(), service_type: serviceType, amount: rawAmount, status: "requested", simulated, notes: typeof body.notes === "string" ? body.notes : null }).select("*").single();
    if (error) return jsonError("Unable to record service", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "agent_service_recorded", entity_type: "agent_service", entity_id: data.id, metadata: { simulated } });
    return Response.json(data, { status: 201 });
  }

  return jsonError("Unsupported agent action", 400);
}
