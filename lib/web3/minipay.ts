import type { EIP1193Provider } from "viem";

export type MiniPayProvider = EIP1193Provider & {
  isMiniPay?: boolean;
  providers?: Array<EIP1193Provider & { isMiniPay?: boolean }>;
};

export function isMiniPayProvider(provider: unknown): provider is MiniPayProvider {
  return typeof provider === "object" && provider !== null &&
    "isMiniPay" in provider && provider.isMiniPay === true &&
    "request" in provider && typeof provider.request === "function";
}

export function getMiniPayProvider(): MiniPayProvider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as Window & { ethereum?: unknown }).ethereum;
  if (isMiniPayProvider(ethereum)) return ethereum;
  if (typeof ethereum === "object" && ethereum !== null && "providers" in ethereum && Array.isArray(ethereum.providers)) {
    return ethereum.providers.find(isMiniPayProvider) ?? null;
  }
  return null;
}
