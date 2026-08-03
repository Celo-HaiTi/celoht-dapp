"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/**
 * Wallet connector SDKs pulled in by `wagmi/connectors` (WalletConnect,
 * MetaMask SDK, etc.) assume a browser environment and, in some versions,
 * touch React APIs at module-evaluation time in a way that breaks Next.js
 * server-side rendering. Since wallet connection has no meaningful
 * server-rendered state anyway, we load the whole Web3Provider
 * client-side only.
 */
const Web3ProviderClientOnly = dynamic(
  () => import("@/lib/web3/Web3Provider").then((mod) => mod.Web3Provider),
  { ssr: false },
);

export function Web3Gate({ children }: { children: ReactNode }) {
  return <Web3ProviderClientOnly>{children}</Web3ProviderClientOnly>;
}
