import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { verifyMessage, type Address } from "viem";

const SESSION_COOKIE = "celoht_pilot_session";

export function getPilotSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? createClient(url, serviceRoleKey, { auth: { persistSession: false } }) : null;
}

export function createWalletNonce(): string {
  return randomBytes(24).toString("hex");
}

export async function verifyWalletSignature(walletAddress: string, nonce: string, signature: string): Promise<boolean> {
  if (!/^0x[0-9a-fA-F]{40}$/.test(walletAddress) || !/^0x[0-9a-fA-F]{130}$/.test(signature)) return false;
  try {
    return await verifyMessage({ address: walletAddress as Address, message: `CeloHT pilot login nonce: ${nonce}`, signature: signature as `0x${string}` });
  } catch {
    return false;
  }
}

export function signSession(walletAddress: string, role: string): string {
  const secret = process.env.PILOT_SESSION_SECRET;
  if (!secret) throw new Error("PILOT_SESSION_SECRET is required");
  const payload = Buffer.from(JSON.stringify({ walletAddress: walletAddress.toLowerCase(), role, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}

export async function getPilotSession(): Promise<{ walletAddress: string; role: string } | null> {
  const secret = process.env.PILOT_SESSION_SECRET;
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const supplied = Buffer.from(signature, "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { walletAddress?: string; role?: string; exp?: number };
    if (!data.walletAddress || !data.role || !data.exp || data.exp < Date.now()) return null;
    return { walletAddress: data.walletAddress, role: data.role };
  } catch {
    return null;
  }
}

export function requireAdmin(session: { role: string } | null): boolean {
  return session?.role === "admin";
}

export function requireReviewer(session: { role: string } | null): boolean {
  return session?.role === "admin" || session?.role === "authorized_reviewer";
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 24 * 60 * 60,
  };
}

export function clearSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: { message } }, { status });
}
