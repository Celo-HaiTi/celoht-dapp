import { getPilotSession, getPilotSupabase, jsonError, requireAdmin, requireReviewer } from "@/lib/server/pilot";

export async function GET() {
  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);
  const session = await getPilotSession();
  let query = supabase.from("planting_events").select("*,tree_survival_records(*)").order("created_at", { ascending: false }).limit(100);
  if (!session || !requireReviewer(session)) query = query.eq("status", "verified");
  else if (session) query = query.or(`submitted_by.eq.${session.walletAddress},status.not.eq.submitted`);
  const { data, error } = await query;
  if (error) return jsonError("Unable to load planting records", 500);
  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  const session = await getPilotSession();
  if (!session) return jsonError("Authentication required", 401);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.action) return jsonError("Action required", 400);
  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);

  if (body.action === "submit") {
    const required = [body.projectName, body.location, body.species, body.plantingDate, body.responsibleGroup];
    if (required.some((value) => typeof value !== "string" || value.trim().length === 0)) return jsonError("Project, location, species, date, and responsible group are required", 400);
    const planted = Number(body.treesPlanted);
    const planned = body.treesPlanned === undefined ? 0 : Number(body.treesPlanned);
    if (!Number.isInteger(planted) || planted < 0 || !Number.isInteger(planned) || planned < 0) return jsonError("Tree counts must be non-negative integers", 400);
    const { data, error } = await supabase.from("planting_events").insert({ project_name: String(body.projectName), location: String(body.location), gps_lat: body.gpsLat === undefined ? null : Number(body.gpsLat), gps_lng: body.gpsLng === undefined ? null : Number(body.gpsLng), species: String(body.species), trees_planned: planned, trees_planted: planted, planting_date: String(body.plantingDate), responsible_group: String(body.responsibleGroup), supporting_document_urls: Array.isArray(body.supportingDocuments) ? body.supportingDocuments : [], photograph_urls: Array.isArray(body.photographs) ? body.photographs : [], status: "submitted", submitted_by: session.walletAddress }).select("*").single();
    if (error) return jsonError("Unable to submit planting record", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "planting_submitted", entity_type: "planting_event", entity_id: data.id });
    return Response.json(data, { status: 201 });
  }

  if (body.action === "review" || body.action === "survival") {
    if (!requireReviewer(session)) return jsonError("Administrator or authorized reviewer role required", 403);
  }

  if (body.action === "review") {
    const status = String(body.status ?? "");
    if (!["under_review","verified","rejected","needs_additional_evidence"].includes(status)) return jsonError("Invalid review status", 400);
    const verifiedTrees = body.verifiedTrees === undefined ? 0 : Number(body.verifiedTrees);
    if (!Number.isInteger(verifiedTrees) || verifiedTrees < 0) return jsonError("Verified tree count invalid", 400);
    const plantedRow = await supabase.from("planting_events").select("trees_planted").eq("id", String(body.eventId)).single();
    if (plantedRow.error || !plantedRow.data || verifiedTrees > plantedRow.data.trees_planted) return jsonError("Verified trees cannot exceed planted trees", 400);
    const { error } = await supabase.from("planting_events").update({ status, verified_trees: verifiedTrees, reviewed_by: session.walletAddress, reviewed_at: new Date().toISOString(), reviewer_notes: typeof body.notes === "string" ? body.notes : null }).eq("id", String(body.eventId));
    if (error) return jsonError("Unable to review planting record", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "planting_reviewed", entity_type: "planting_event", entity_id: String(body.eventId), metadata: { status, verifiedTrees } });
    return Response.json({ reviewed: true });
  }

  if (body.action === "survival") {
    const months = Number(body.followUpMonths);
    const inspected = Number(body.treesInspected);
    const surviving = Number(body.treesSurviving);
    if (![6,18].includes(months) || !Number.isInteger(inspected) || inspected < 0 || !Number.isInteger(surviving) || surviving < 0 || surviving > inspected) return jsonError("Invalid survival record", 400);
    const lost = inspected - surviving;
    const { error } = await supabase.from("tree_survival_records").upsert({ planting_event_id: String(body.eventId), follow_up_months: months, trees_inspected: inspected, trees_surviving: surviving, trees_lost: lost, inspection_date: String(body.inspectionDate ?? new Date().toISOString().slice(0,10)), evidence_urls: Array.isArray(body.evidence) ? body.evidence : [], responsible_reviewer: session.walletAddress, reviewer_notes: typeof body.notes === "string" ? body.notes : null }, { onConflict: "planting_event_id,follow_up_months" });
    if (error) return jsonError("Unable to record survival inspection", 500);
    await supabase.from("audit_logs").insert({ actor_wallet: session.walletAddress, action: "survival_recorded", entity_type: "planting_event", entity_id: String(body.eventId), metadata: { months, inspected, surviving, lost } });
    return Response.json({ recorded: true });
  }
  return jsonError("Unsupported reforestation action", 400);
}
