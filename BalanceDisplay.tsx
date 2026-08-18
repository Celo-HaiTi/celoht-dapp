"use client";

import { useAccount, useBalance } from "wagmi";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Displays the connected wallet's native CELO balance (used for gas) and,
 * when a USDm token address is provided, its USDm balance.
 */
export function BalanceDisplay({ usdmAddress }: { usdmAddress?: `0x${string}` }) {
  const { address, isConnected } = useAccount();

  const celoBalance = useBalance({ address, query: { enabled: isConnected } });
  const usdmBalance = useBalance({
    address,
    token: usdmAddress,
    query: { enabled: isConnected && Boolean(usdmAddress) },
  });

  if (!isConnected) {
    return (
      <p className="text-ink-soft dark:text-parchment-100/70 text-sm">
        Connect your wallet to see your CELO and USDm balances.
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-4">
      <div className="border-navy-700/15 dark:border-parchment-100/10 rounded-xl border p-4">
        <dt className="text-ink-soft dark:text-parchment-100/50 text-xs tracking-wide uppercase">
          CELO (for gas)
        </dt>
        {celoBalance.isLoading ? (
          <Skeleton className="mt-2 h-7 w-24" />
        ) : (
          <dd className="mt-1 font-mono text-2xl font-semibold">
            {celoBalance.data ? Number(celoBalance.data.formatted).toFixed(4) : "—"}
          </dd>
        )}
      </div>
      <div className="border-navy-700/15 dark:border-parchment-100/10 rounded-xl border p-4">
        <dt className="text-ink-soft dark:text-parchment-100/50 text-xs tracking-wide uppercase">
          USDm
        </dt>
        {!usdmAddress ? (
          <dd className="text-ink-soft dark:text-parchment-100/60 mt-1 text-sm">
            Not configured for this network
          </dd>
        ) : usdmBalance.isLoading ? (
          <Skeleton className="mt-2 h-7 w-24" />
        ) : (
          <dd className="mt-1 font-mono text-2xl font-semibold">
            {usdmBalance.data ? Number(usdmBalance.data.formatted).toFixed(2) : "—"}
          </dd>
        )}
      </div>
    </dl>
  );
}
