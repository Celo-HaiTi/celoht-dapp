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
    const status = String(body.status ?? "");
    if (!["pending","under_review","approved","rejected","additional_information_required","suspended"].includes(status)) return jsonError("Invalid application status", 400);
    const { error } = await supabase.from("agent_applications").update({ status, reviewer_notes: typeof body.notes === "string" ? body.notes : null, reviewed_by: session.walletAddress, reviewed_at: new Date().toISOString() }).eq("id", String(body.applicationId));
    if (error) return jsonError("Unable to review application", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "agent_application_reviewed", entity_type: "agent_application", entity_id: String(body.applicationId), metadata: { status } });
    if (status === "approved") await supabase.from("profiles").update({ role: "verified_agent" }).eq("wallet_address", String(body.walletAddress ?? "").toLowerCase());
    return Response.json({ reviewed: true });
  }

  if (body.action === "service") {
    const serviceType = String(body.serviceType ?? "customer_support");
    if (!["cash_in_simulation","cash_out_simulation","wallet_onboarding","customer_support","other"].includes(serviceType)) return jsonError("Invalid service type", 400);
    const simulated = serviceType === "cash_in_simulation" || serviceType === "cash_out_simulation";
    const { data, error } = await supabase.from("agent_services").insert({ agent_wallet: session.walletAddress, customer_reference: String(body.customerReference ?? "").trim(), service_type: serviceType, amount: body.amount === undefined ? null : String(body.amount), status: "requested", simulated, notes: typeof body.notes === "string" ? body.notes : null }).select("*").single();
    if (error) return jsonError("Unable to record service", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "agent_service_recorded", entity_type: "agent_service", entity_id: data.id, metadata: { simulated } });
    return Response.json(data, { status: 201 });
  }

  return jsonError("Unsupported agent action", 400);
}
