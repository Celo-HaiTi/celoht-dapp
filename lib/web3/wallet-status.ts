export type WalletConnectionStatus =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Wrong Network"
  | "Network Offline"
  | "Provider Unavailable"
  | "Connection Error";

export function getWalletConnectionStatus(input: {
  online?: boolean;
  isConnecting?: boolean;
  isPending?: boolean;
  error?: boolean;
  isConnected?: boolean;
  chainId?: number;
  supportedChainIds?: number[];
  providerAvailable?: boolean;
}): WalletConnectionStatus {
  if (input.online === false) return "Network Offline";
  if (input.error) return "Connection Error";
  if (input.providerAvailable === false) return "Provider Unavailable";
  if (input.isConnecting || input.isPending) return "Connecting";
  if (!input.isConnected) return "Disconnected";
  if (input.supportedChainIds && input.chainId && !input.supportedChainIds.includes(input.chainId)) return "Wrong Network";
  return "Connected";
}
