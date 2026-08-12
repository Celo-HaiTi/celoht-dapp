export type Asset = "CELO" | "cUSD";

export type TransferInput = {
  asset: Asset;
  amount: string;
  recipient: string;
  balance: number;
  isConnected: boolean;
  wrongNetwork: boolean;
};

export function isLikelyCeloAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function formatCurrency(value: number | string, digits = 2): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function validateTransferInput(input: TransferInput): { valid: boolean; error: string | null } {
  if (!input.isConnected) {
    return { valid: false, error: "Connect your wallet to send assets." };
  }

  if (input.wrongNetwork) {
    return { valid: false, error: "Switch to Celo Mainnet to continue." };
  }

  if (!input.recipient || !isLikelyCeloAddress(input.recipient)) {
    return { valid: false, error: "Enter a valid recipient wallet address." };
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, error: "Enter an amount greater than zero." };
  }

  if (amount > input.balance) {
    return { valid: false, error: `Insufficient ${input.asset} balance.` };
  }

  return { valid: true, error: null };
}
