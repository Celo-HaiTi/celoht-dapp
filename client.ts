/**
 * Supabase client for CeloHT's off-chain data: course content, extended
 * agent/partner profiles, and anything else that doesn't belong on-chain.
 * On-chain state (agent status, certificates, donations, planting
 * records, votes) is read directly via wagmi/viem — see
 * src/lib/contracts/.
 *
 * This client is intentionally lazy and optional: when the Supabase env
 * vars are absent, `getSupabaseClient()` returns null and callers must
 * surface an explicit unavailable state rather than fabricating records or
 * silently substituting sample data. See docs/API.md for the expected
 * schema and docs/DEVELOPMENT.md for setup.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cachedClient = null;
    return null;
  }

  cachedClient = createClient(url, anonKey);
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
