export type WalletConnectProjectIdResult = {
  projectId?: string;
  error?: "missing" | "invalid" | "conflict";
};

const PROJECT_ID_PATTERN = /^[0-9a-f]{32}$/i;

export function resolveWalletConnectProjectId(
  walletConnectValue?: string | null,
  reownValue?: string | null,
): WalletConnectProjectIdResult {
  const walletConnectId = walletConnectValue?.trim() ?? "";
  const reownId = reownValue?.trim() ?? "";

  if (walletConnectId && reownId && walletConnectId !== reownId) return { error: "conflict" };
  const projectId = walletConnectId || reownId;
  if (!projectId) return { error: "missing" };
  if (!PROJECT_ID_PATTERN.test(projectId)) return { error: "invalid" };
  return { projectId };
}