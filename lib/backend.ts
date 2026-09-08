import type { Address } from "viem";

export type BackendError = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) throw new BackendRequestError(0, { code: "unavailable", message: "Backend is not configured." });

  const response = await fetch(backendApiUrl(baseUrl, path), {
    ...init,
    credentials: "include",
    headers: { "content-type": "application/json", ...init?.headers },
  });
  const body = (await response.json().catch(() => undefined)) as { data?: T; error?: BackendError } | undefined;
  if (!response.ok || !body?.data) {
    throw new BackendRequestError(response.status, body?.error ?? { code: "request_failed", message: "Backend request failed." });
  }
  return body.data;
}

export function requestWalletNonce(walletAddress: Address) {
  return request<{ message: string; nonce: string; expiresAt: string }>("/auth/nonce", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

export function verifyWalletSignature(walletAddress: Address, nonce: string, signature: `0x${string}`) {
  return request<{ profileId: string; walletAddress: string }>("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ walletAddress, nonce, signature }),
  });
}

export function logoutBackendSession() {
  return request<{ loggedOut: boolean }>("/auth/logout", { method: "POST" });
}

export function getBackendProfile() {
  return request<{ id: string; walletAddress: string; displayName?: string; avatarUrl?: string }>("/profile");
}

export function getBackendAgentApplication() {
  return request<unknown>("/agents");
}

export function getBackendCourses() {
  return request<unknown[]>("/courses");
}

export function getBackendProgress() {
  return request<unknown[]>("/progress");
}

export function getBackendReforestation() {
  return request<unknown[]>("/reforestation");
}

export function getBackendEvidence() {
  return request<unknown[]>("/reforestation/evidence");
}

export function getBackendGovernance() {
  return request<unknown[]>("/governance");
}
