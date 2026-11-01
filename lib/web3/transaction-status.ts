export type TransactionStatus =
  | "idle"
  | "awaiting_approval"
  | "submitted"
  | "pending"
  | "confirmed"
  | "failed"
  | "rejected";

function isWalletRejection(error: unknown): boolean {
  let current = error;
  while (typeof current === "object" && current !== null) {
    if ("code" in current && Number(current.code) === 4001) return true;
    if ("message" in current && typeof current.message === "string") {
      const message = current.message.toLowerCase();
      if (message.includes("user rejected") || message.includes("user denied")) return true;
    }
    current = "cause" in current ? current.cause : null;
  }
  return false;
}

export function getTransactionStatus(input: {
  isAwaitingApproval?: boolean;
  transactionHash?: string;
  isReceiptPending?: boolean;
  receiptStatus?: "success" | "reverted";
  error?: unknown;
}): TransactionStatus {
  if (isWalletRejection(input.error)) return "rejected";
  if (input.receiptStatus === "success") return "confirmed";
  if (input.receiptStatus === "reverted" || input.error) return "failed";
  if (!input.transactionHash) return input.isAwaitingApproval ? "awaiting_approval" : "idle";
  return input.isReceiptPending ? "pending" : "submitted";
}