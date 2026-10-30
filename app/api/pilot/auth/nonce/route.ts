import { cookies } from "next/headers";
import { createWalletNonce } from "@/lib/server/pilot";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { walletAddress?: string } | null;
  if (!body?.walletAddress || !/^0x[0-9a-fA-F]{40}$/.test(body.walletAddress)) {
    return Response.json({ error: { message: "Valid wallet address required" } }, { status: 400 });
  }
  const nonce = createWalletNonce();
  const store = await cookies();
  store.set("celoht_pilot_nonce", nonce, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 300 });
  store.set("celoht_pilot_nonce_wallet", body.walletAddress.toLowerCase(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 300 });
  return Response.json({ nonce, message: `CeloHT pilot login nonce: ${nonce}` });
}
