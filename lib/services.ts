import type { Address, Hash } from "viem";

export type ActivityItem = { hash: Hash; type: "received" | "sent" | "contract" | "impact"; asset: string; amount: string; timestamp: number; status: "pending" | "confirmed" | "failed"; counterparty?: Address };
export interface WalletAuthService { createNonce(address: Address): Promise<string>; verifySignature(address: Address, signature: string): Promise<boolean>; }
export interface TransactionIndexerService { listActivity(address: Address): Promise<ActivityItem[]>; }
export interface ImpactService { donate(projectId: string, amount: bigint): Promise<Hash>; getMetrics(): Promise<{ treesPlanted: number; contributions: number } | null>; }
export interface AgentService { listAgents(): Promise<readonly unknown[]>; }
export interface AcademyService { getProgress(address?: Address): Promise<readonly string[]>; saveProgress(courseId: string, address?: Address): Promise<void>; }
export const unavailableServices = { walletAuth: null as WalletAuthService | null, transactionIndexer: null as TransactionIndexerService | null, impact: null as ImpactService | null, agents: null as AgentService | null, academy: null as AcademyService | null };