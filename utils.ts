import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists, letting later classes win on conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shorten a 0x address to `0x1234…abcd` for display. */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}\u2026${address.slice(-chars)}`;
}

/** Format a bigint token amount (18 decimals, e.g. USDm) as a display string. */
export function formatTokenAmount(value: bigint, decimals = 18, maxFractionDigits = 2): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, maxFractionDigits);
  return `${whole.toLocaleString()}${maxFractionDigits > 0 ? `.${fractionStr}` : ""}`;
}
