"use client";

import { useAccount } from "wagmi";
import { celoSepolia } from "wagmi/chains";

export function getWalletChainId(connectionChainId?: number): number {
  return connectionChainId ?? celoSepolia.id;
}

export function useWalletChainId(): number {
  const { chainId } = useAccount();
  return getWalletChainId(chainId);
}