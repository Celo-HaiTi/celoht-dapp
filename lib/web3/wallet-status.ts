export type WalletConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrong_network"
  | "reconnecting"
  | "disconnecting"
  | "error";

export function getWalletConnectionStatus(input: {
  accountStatus?: "connected" | "connecting" | "reconnecting" | "disconnected";
  isDisconnecting?: boolean;
  hasError?: boolean;
  isConnected?: boolean;
  chainId?: number;
  supportedChainId: number;
}): WalletConnectionStatus {
  if (input.hasError) return "error";
  if (input.isDisconnecting) return "disconnecting";
  if (input.accountStatus === "reconnecting") return "reconnecting";
  if (input.accountStatus === "connecting") return "connecting";
  if (!input.isConnected || input.accountStatus === "disconnected") return "disconnected";
  if (input.chainId !== input.supportedChainId) return "wrong_network";
  return "connected";
}
