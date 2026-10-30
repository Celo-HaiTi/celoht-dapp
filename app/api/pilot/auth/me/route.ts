import { getPilotSession, jsonError } from "@/lib/server/pilot";

export async function GET() {
  const session = await getPilotSession();
  if (!session) return jsonError("Not authenticated", 401);
  return Response.json(session);
}
