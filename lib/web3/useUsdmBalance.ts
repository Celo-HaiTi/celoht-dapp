"use client";

import type { Address } from "viem";
import { useReadContract } from "wagmi";
import { erc20Abi, getUsdmAddress } from "@/lib/contracts";

export function useUsdmBalance(address?: Address, chainId?: number, addressOverride?: Address) {
  const usdmAddress = addressOverride ?? (chainId ? getUsdmAddress(chainId) : undefined);
  const balance = useReadContract({
    address: usdmAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && usdmAddress) },
  });

  const data = typeof balance.data === "bigint"
    ? { value: balance.data, decimals: 18 }
    : undefined;

  return { ...balance, data };
}
