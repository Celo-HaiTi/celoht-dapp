import * as runtime from "./dedupe.mjs";
import type { NotificationType } from "./types";

export const transactionDeduplicationKey = runtime.transactionDeduplicationKey as (chainId: number, hash: string, state: "confirmed" | "failed") => string;
export const securityDeduplicationKey = runtime.securityDeduplicationKey as (walletAddress: string, reason: string) => string;
export const entityDeduplicationKey = runtime.entityDeduplicationKey as (type: NotificationType, entityId: string, walletAddress: string) => string;