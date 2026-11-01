import type { Address } from "viem";

export type BackendError = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export type BackendProfile = { profileId: string; walletAddress: string; role: string; displayName: string | null; avatarUrl: string | null };
export type BackendCourse = { id: string; title: string; description: string | null; created_at: string };
export type BackendProgressRecord = { lesson_id: string; completed: boolean; completed_at: string | null };
export type BackendAgentApplication = { id: string; off_chain_kyc_status: string; on_chain_registry_status: string | null; created_at: string; updated_at: string };
export type BackendReforestationProject = { id: string; title: string; description: string | null; location: string | null; financialContributionCount: number; verifiedTreesPlanted: number };
export type BackendEvidence = { id: string; project_id: string; trees_verified: number | null; verified_at: string | null; created_at: string };
export type BackendTransaction = { id: string; chain_id: number; contract_address: string | null; transaction_hash: string; event_name: string; block_number: number | string; confirmed: boolean; created_at: string };
export type BackendGovernanceActivity = { eventName: string; transactionHash: string; blockNumber: string; occurredAt: string; actor: string | null; vote: "for" | "against" | "abstain" | null };
export type BackendGovernanceProposal = {
  id: string;
  onChainProposalId: string;
  title: string | null;
  description: string | null;
  metadataURI: string;
  contentHash: string;
  proposer: string;
  status: "upcoming" | "voting" | "awaiting_finalization" | "finalized";
  indexedStatus: string;
  votingStartsAt: string;
  votingEndsAt: string;
  finalized: boolean;
  votes: { for: string; against: string; abstain: string };
  activity: BackendGovernanceActivity[];
  walletVoteState: { hasVoted: boolean; usdmBalance: string; usdmAllowance: string; isAuthorizedProposer: boolean } | null;
};
export type BackendGovernance = {
  contract: {
    chainId: number;
    address: string;
    usdmAddress: string;
    usdmDecimals: number;
    participationFee: string;
    treasury: string;
    votingRequiresRole: false;
    walletIsAuthorizedProposer: boolean | null;
  };
  proposals: BackendGovernanceProposal[];
};

export class BackendRequestError extends Error {
  constructor(public readonly status: number, public readonly details: BackendError) {
    super(details.message);
    this.name = "BackendRequestError";
  }
}

function backendBaseUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  return value ? value.replace(/\/$/, "") : undefined;
}

function backendApiUrl(baseUrl: string, path: string): string {
  return baseUrl.endsWith("/v1") || baseUrl.endsWith("/api/v1") ? `${baseUrl}${path}` : `${baseUrl}/api/v1${path}`;
}

export function isBackendConfigured(): boolean {
  return Boolean(backendBaseUrl());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isArrayOf<T>(value: unknown, validate: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(validate);
}

function isBackendProfile(value: unknown): value is BackendProfile {
  return isRecord(value) && isString(value.profileId) && isString(value.walletAddress) && isString(value.role)
    && isNullableString(value.displayName) && isNullableString(value.avatarUrl);
}

function isBackendCourse(value: unknown): value is BackendCourse {
  return isRecord(value) && isString(value.id) && isString(value.title) && isNullableString(value.description) && isString(value.created_at);
}

function isBackendProgressRecord(value: unknown): value is BackendProgressRecord {
  return isRecord(value) && isString(value.lesson_id) && typeof value.completed === "boolean" && isNullableString(value.completed_at);
}

function isBackendAgentApplication(value: unknown): value is BackendAgentApplication {
  return isRecord(value) && isString(value.id) && isString(value.off_chain_kyc_status)
    && isNullableString(value.on_chain_registry_status) && isString(value.created_at) && isString(value.updated_at);
}

function isBackendTransaction(value: unknown): value is BackendTransaction {
  return isRecord(value) && isString(value.id) && typeof value.chain_id === "number"
    && isNullableString(value.contract_address) && isString(value.transaction_hash) && isString(value.event_name)
    && (typeof value.block_number === "number" || isString(value.block_number))
    && typeof value.confirmed === "boolean" && isString(value.created_at);
}

function isBackendReforestationProject(value: unknown): value is BackendReforestationProject {
  return isRecord(value) && isString(value.id) && isString(value.title) && isNullableString(value.description)
    && isNullableString(value.location) && typeof value.financialContributionCount === "number"
    && typeof value.verifiedTreesPlanted === "number";
}

function isBackendEvidence(value: unknown): value is BackendEvidence {
  return isRecord(value) && isString(value.id) && isString(value.project_id)
    && (value.trees_verified === null || typeof value.trees_verified === "number")
    && isNullableString(value.verified_at) && isString(value.created_at);
}

function isBackendGovernanceActivity(value: unknown): value is BackendGovernanceActivity {
  return isRecord(value) && isString(value.eventName) && isString(value.transactionHash)
    && isString(value.blockNumber) && isString(value.occurredAt) && isNullableString(value.actor)
    && (value.vote === null || value.vote === "for" || value.vote === "against" || value.vote === "abstain");
}

function isBackendGovernanceProposal(value: unknown): value is BackendGovernanceProposal {
  if (!isRecord(value) || !isRecord(value.votes)) return false;
  const walletVoteState = value.walletVoteState;
  return isString(value.id) && isString(value.onChainProposalId) && isNullableString(value.title)
    && isNullableString(value.description) && isString(value.metadataURI) && isString(value.contentHash)
    && isString(value.proposer) && (value.status === "upcoming" || value.status === "voting" || value.status === "awaiting_finalization" || value.status === "finalized")
    && isString(value.indexedStatus) && isString(value.votingStartsAt) && isString(value.votingEndsAt)
    && typeof value.finalized === "boolean" && isString(value.votes.for) && isString(value.votes.against)
    && isString(value.votes.abstain) && isArrayOf(value.activity, isBackendGovernanceActivity)
    && (walletVoteState === null || (isRecord(walletVoteState) && typeof walletVoteState.hasVoted === "boolean"
      && isString(walletVoteState.usdmBalance) && isString(walletVoteState.usdmAllowance)
      && typeof walletVoteState.isAuthorizedProposer === "boolean"));
}

function isBackendGovernance(value: unknown): value is BackendGovernance {
  if (!isRecord(value) || !isRecord(value.contract)) return false;
  const contract = value.contract;
  return typeof contract.chainId === "number" && isString(contract.address) && isString(contract.usdmAddress)
    && typeof contract.usdmDecimals === "number" && isString(contract.participationFee) && isString(contract.treasury)
    && contract.votingRequiresRole === false && (contract.walletIsAuthorizedProposer === null || typeof contract.walletIsAuthorizedProposer === "boolean")
    && isArrayOf(value.proposals, isBackendGovernanceProposal);
}

function fallbackError(status: number): BackendError {
  if (status === 401) return { code: "unauthorized", message: "Your session has expired. Sign in again." };
  if (status === 403) return { code: "forbidden", message: "You are not authorized to perform this action." };
  if (status === 404) return { code: "not_found", message: "The requested backend resource is unavailable." };
  if (status === 429) return { code: "rate_limited", message: "Too many requests. Please try again shortly." };
  if (status >= 500) return { code: "backend_unavailable", message: "The backend is temporarily unavailable." };
  if (status === 0) return { code: "network_unavailable", message: "The backend could not be reached." };
  return { code: "request_failed", message: "The backend request failed." };
}

function responseError(body: unknown, status: number, requestId?: string): BackendError {
  const fallback = fallbackError(status);
  if (typeof body !== "object" || body === null || !("error" in body)) {
    return { ...fallback, requestId };
  }
  const error = body.error;
  if (typeof error !== "object" || error === null) return { ...fallback, requestId };
  const value = error as Partial<BackendError>;
  return {
    ...fallback,
    ...value,
    code: typeof value.code === "string" ? value.code : fallback.code,
    message: typeof value.message === "string" ? value.message : fallback.message,
    requestId: typeof value.requestId === "string" ? value.requestId : requestId,
  };
}

function retryDelayMs(response: Response): number {
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) return 250;
  const seconds = Number(retryAfter);
  const delay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now();
  return Number.isFinite(delay) ? Math.min(Math.max(delay, 0), 1000) : 250;
}

async function request<T>(path: string, init: RequestInit | undefined, validate: (value: unknown) => value is T): Promise<T> {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) throw new BackendRequestError(0, { code: "unavailable", message: "Backend is not configured." });

  const method = (init?.method ?? "GET").toUpperCase();
  const canRetry = method === "GET";
  let response: Response | undefined;
  let networkError: unknown;

  for (let attempt = 0; attempt < (canRetry ? 2 : 1); attempt += 1) {
    try {
      response = await fetch(backendApiUrl(baseUrl, path), {
        ...init,
        credentials: "include",
        signal: AbortSignal.timeout(10_000),
        headers: { "content-type": "application/json", ...init?.headers },
      });
      if (!response) break;
      if (!canRetry || attempt > 0 || (response.status < 500 && response.status !== 429)) break;
      const retryResponse = response;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs(retryResponse)));
    } catch (cause) {
      networkError = cause;
      if (!canRetry || attempt > 0) {
        const message = cause instanceof Error && cause.name === "TimeoutError"
          ? "The backend request timed out."
          : "The backend could not be reached.";
        throw new BackendRequestError(0, { code: "network_unavailable", message });
      }
    }
  }

  if (!response) {
    const message = networkError instanceof Error && networkError.name === "TimeoutError"
      ? "The backend request timed out."
      : "The backend could not be reached.";
    throw new BackendRequestError(0, { code: "network_unavailable", message });
  }

  const body: unknown = await response.json().catch(() => undefined);
  const requestId = response.headers.get("x-request-id") ?? undefined;
  if (!response.ok) throw new BackendRequestError(response.status, responseError(body, response.status, requestId));
  if (!isRecord(body) || !("data" in body)) {
    throw new BackendRequestError(response.status, {
      code: "invalid_response",
      message: "The backend returned an invalid response envelope.",
      requestId,
    });
  }
  if (!validate(body.data)) {
    throw new BackendRequestError(response.status, {
      code: "invalid_response",
      message: "The backend returned data that does not match the documented response schema.",
      requestId,
    });
  }
  return body.data;
}

export function requestWalletNonce(walletAddress: Address) {
  return request<{ message: string; nonce: string; expiresAt: string }>("/auth/nonce", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  }, (value): value is { message: string; nonce: string; expiresAt: string } => isRecord(value)
    && isString(value.message) && isString(value.nonce) && isString(value.expiresAt));
}

export function verifyWalletSignature(walletAddress: Address, nonce: string, signature: `0x${string}`) {
  return request<{ profileId: string; walletAddress: string }>("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ walletAddress, nonce, signature }),
  }, (value): value is { profileId: string; walletAddress: string } => isRecord(value)
    && isString(value.profileId) && isString(value.walletAddress));
}

export function logoutBackendSession() {
  return request<{ loggedOut: boolean }>("/auth/logout", { method: "POST" },
    (value): value is { loggedOut: boolean } => isRecord(value) && typeof value.loggedOut === "boolean");
}

export function getBackendProfile() {
  return request<BackendProfile>("/profile", undefined, isBackendProfile);
}

export function getBackendAgentApplication() {
  return request<BackendAgentApplication>("/agents", undefined, isBackendAgentApplication);
}

export function getBackendCourses() {
  return request<BackendCourse[]>("/courses", undefined, (value): value is BackendCourse[] => isArrayOf(value, isBackendCourse));
}

export function getBackendProgress() {
  return request<BackendProgressRecord[]>("/progress", undefined, (value): value is BackendProgressRecord[] => isArrayOf(value, isBackendProgressRecord));
}

export function saveBackendProgress(lessonId: string, completed: boolean) {
  return request<BackendProgressRecord>("/progress", {
    method: "POST",
    body: JSON.stringify({ lessonId, completed }),
  }, isBackendProgressRecord);
}

export function submitBackendAgentApplication(applicationData: Record<string, unknown>) {
  return request<Pick<BackendAgentApplication, "id" | "off_chain_kyc_status">>("/agents", {
    method: "POST",
    body: JSON.stringify({ applicationData }),
  }, (value): value is Pick<BackendAgentApplication, "id" | "off_chain_kyc_status"> => isRecord(value)
    && isString(value.id) && isString(value.off_chain_kyc_status));
}

export function getBackendTransactions(walletAddress?: Address) {
  const query = walletAddress ? `?wallet=${encodeURIComponent(walletAddress)}` : "";
  return request<BackendTransaction[]>(`/transactions${query}`, undefined, (value): value is BackendTransaction[] => isArrayOf(value, isBackendTransaction));
}

export function getBackendReforestation() {
  return request<BackendReforestationProject[]>("/reforestation", undefined, (value): value is BackendReforestationProject[] => isArrayOf(value, isBackendReforestationProject));
}

export function getBackendEvidence() {
  return request<BackendEvidence[]>("/reforestation/evidence", undefined, (value): value is BackendEvidence[] => isArrayOf(value, isBackendEvidence));
}

export function getBackendGovernance(walletAddress?: Address) {
  const query = walletAddress ? `?wallet=${encodeURIComponent(walletAddress)}` : "";
  return request<BackendGovernance>(`/governance${query}`, undefined, isBackendGovernance);
}
