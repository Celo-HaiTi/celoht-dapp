export type MiniPayProvider = {
  isMiniPay?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export function getMiniPayProvider(): MiniPayProvider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as Window & { ethereum?: MiniPayProvider }).ethereum;
  return ethereum?.isMiniPay ? ethereum : null;
}

export async function requestMiniPayAccount(provider: MiniPayProvider): Promise<{ address: string; chainId: number }> {
  const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
  if (!Array.isArray(accounts) || !/^0x[0-9a-fA-F]{40}$/.test(accounts[0] ?? "")) {
    throw new Error("MiniPay did not return an account.");
  }
  const chainIdHex = await provider.request({ method: "eth_chainId" }) as string;
  const chainId = Number.parseInt(chainIdHex, 16);
  if (!Number.isInteger(chainId)) throw new Error("MiniPay did not return a valid chain ID.");
  return { address: accounts[0], chainId };
}

export async function switchMiniPayToSepolia(provider: MiniPayProvider) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xaa044c" }] });
  } catch (cause) {
    const errorCode = typeof cause === "object" && cause !== null && "code" in cause ? Number((cause as { code?: unknown }).code) : undefined;
    if (errorCode !== 4902) throw cause;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [{ chainId: "0xaa044c", chainName: "Celo Sepolia", nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 }, rpcUrls: ["https://forno.celo-sepolia.celo-testnet.org"], blockExplorerUrls: ["https://celo-sepolia.blockscout.com"] }],
    });
  }
  const chainIdHex = await provider.request({ method: "eth_chainId" }) as string;
  if (Number.parseInt(chainIdHex, 16) !== 11142220) throw new Error("MiniPay did not switch to Celo Sepolia.");
}
