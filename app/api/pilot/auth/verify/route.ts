import { cookies } from "next/headers";
import { clearSessionCookie, getPilotSessionSecret, getPilotSupabase, jsonError, sessionCookie, signSession, verifyWalletSignature } from "@/lib/server/pilot";

export async function POST(request: Request) {
  if (!getPilotSessionSecret()) return jsonError("Pilot session authentication is not configured", 503);
  const body = await request.json().catch(() => null) as { walletAddress?: string; signature?: string } | null;
  if (!body?.walletAddress || !body.signature) return jsonError("Wallet address and signature required", 400);
  const store = await cookies();
  const nonce = store.get("celoht_pilot_nonce")?.value;
  const nonceWallet = store.get("celoht_pilot_nonce_wallet")?.value;
  if (!nonce || nonceWallet !== body.walletAddress.toLowerCase()) return jsonError("Nonce expired or wallet mismatch", 401);
  if (!await verifyWalletSignature(body.walletAddress, nonce, body.signature)) return jsonError("Invalid wallet signature", 401);

  const supabase = getPilotSupabase();
  if (!supabase) return jsonError("Pilot database is not configured", 503);
  const walletAddress = body.walletAddress.toLowerCase();
  const { data: profile, error } = await supabase.from("profiles").select("wallet_address,role").eq("wallet_address", walletAddress).maybeSingle();
  if (error) return jsonError("Unable to load profile", 500);
  let role = profile?.role ?? "learner";
  if (!profile) {
    const created = await supabase.from("profiles").insert({ wallet_address: walletAddress, role: "learner" }).select("role").single();
    if (created.error) return jsonError("Unable to create profile", 500);
    role = created.data.role;
  }
  const token = signSession(walletAddress, role);
  store.set("celoht_pilot_nonce", "", clearSessionCookie());
  store.set("celoht_pilot_nonce_wallet", "", clearSessionCookie());
  store.set(sessionCookie(token));
  return Response.json({ walletAddress, role });
}

export async function DELETE() {
  const store = await cookies();
  store.set(clearSessionCookie());
  return Response.json({ loggedOut: true });
}
