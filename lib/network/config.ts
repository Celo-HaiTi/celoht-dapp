import { type Address } from "viem";
import { celo, celoSepolia } from "wagmi/chains";
import deploymentConfig from "../../deployments/dapp-config.json";

export type EnvironmentMode = "testnet" | "mainnet";
export type SupportedTokenSymbol = "CELO" | "USDm";

export type NetworkConfig = {
  id: number;
  name: string;
  network: EnvironmentMode;
  rpcUrl?: string;
  explorerUrl?: string;
  isConfigured: boolean;
  tokens: {
    celo: {
      symbol: "CELO";
      name: "CELO";
      decimals: number;
      displayName: string;
    };
    usdm: {
      symbol: "USDm";
      name: "USDm";
      decimals: number;
      displayName: string;
      address?: Address;
      explorerUrl?: string;
    };
  };
  contracts: {
    agentRegistry?: Address;
    servicePayments?: Address;
    education?: Address;
    reforestation?: Address;
    governance?: Address;
  };
};

const configSource = deploymentConfig;

const testnetConfig: NetworkConfig = {
  id: celoSepolia.id,
  name: "Celo Sepolia",
  network: "testnet",
  rpcUrl: configSource.celoSepolia?.rpcUrl ?? "https://forno.celo-sepolia.celo-testnet.org",
  explorerUrl: configSource.celoSepolia?.explorerUrl ?? "https://celo-sepolia.blockscout.com",
  isConfigured: true,
  tokens: {
    celo: { symbol: "CELO", name: "CELO", decimals: 18, displayName: "CELO" },
    usdm: {
      symbol: "USDm",
      name: "USDm",
      decimals: 18,
      displayName: "USDm",
      address: (configSource.celoSepolia?.usdm as Address | undefined) ?? undefined,
      explorerUrl: "https://celo-sepolia.blockscout.com/token/0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b",
    },
  },
  contracts: {
    agentRegistry: configSource.celoSepolia?.contracts?.agentRegistry?.address as Address | undefined,
    servicePayments: configSource.celoSepolia?.contracts?.servicePayments?.address as Address | undefined,
    education: configSource.celoSepolia?.contracts?.education?.address as Address | undefined,
    reforestation: configSource.celoSepolia?.contracts?.reforestation?.address as Address | undefined,
    governance: configSource.celoSepolia?.contracts?.governance?.address as Address | undefined,
  },
};

const resolvedMainnetStatus = (() => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
  const configuredNetwork = process.env.NEXT_PUBLIC_CELO_NETWORK?.trim().toLowerCase();
  const chainId = Number(process.env.NEXT_PUBLIC_CELO_CHAIN_ID ?? "");
  const hasMainnetRpc = Boolean(process.env.NEXT_PUBLIC_CELO_RPC_URL?.trim());
  const hasMainnetUsdm = Boolean(process.env.NEXT_PUBLIC_USDM_ADDRESS?.trim());

  if ((appEnv === "mainnet" || configuredNetwork === "mainnet" || configuredNetwork === "celo") && chainId === celo.id && hasMainnetRpc && hasMainnetUsdm) {
    return true;
  }

  return false;
})();

const mainnetConfig: NetworkConfig | undefined = resolvedMainnetStatus
  ? {
      id: celo.id,
      name: "Celo Mainnet",
      network: "mainnet",
      rpcUrl: process.env.NEXT_PUBLIC_CELO_RPC_URL?.trim() || "https://forno.celo.org",
      explorerUrl: process.env.NEXT_PUBLIC_CELO_EXPLORER_URL?.trim() || "https://celoscan.io",
      isConfigured: true,
      tokens: {
        celo: { symbol: "CELO", name: "CELO", decimals: 18, displayName: "CELO" },
        usdm: {
          symbol: "USDm",
          name: "USDm",
          decimals: 18,
          displayName: "USDm",
          address: process.env.NEXT_PUBLIC_USDM_ADDRESS?.trim() as Address | undefined,
          explorerUrl: process.env.NEXT_PUBLIC_CELO_EXPLORER_URL?.trim() ? `${process.env.NEXT_PUBLIC_CELO_EXPLORER_URL?.trim()}/token/${process.env.NEXT_PUBLIC_USDM_ADDRESS}` : undefined,
        },
      },
      contracts: {
        agentRegistry: process.env.NEXT_PUBLIC_CELOHT_AGENT_REGISTRY_ADDRESS?.trim() as Address | undefined,
        servicePayments: process.env.NEXT_PUBLIC_CELOHT_SERVICE_PAYMENTS_ADDRESS?.trim() as Address | undefined,
        education: process.env.NEXT_PUBLIC_CELOHT_EDUCATION_ADDRESS?.trim() as Address | undefined,
        reforestation: process.env.NEXT_PUBLIC_CELOHT_REFORESTATION_ADDRESS?.trim() as Address | undefined,
        governance: process.env.NEXT_PUBLIC_CELOHT_GOVERNANCE_ADDRESS?.trim() as Address | undefined,
      },
    }
  : undefined;

export function resolveEnvironmentMode(): EnvironmentMode {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
  const networkName = process.env.NEXT_PUBLIC_CELO_NETWORK?.trim().toLowerCase();

  if (networkName === "mainnet" || appEnv === "mainnet") {
    return mainnetConfig ? "mainnet" : "testnet";
  }

  if (networkName === "celo" || appEnv === "production") {
    return mainnetConfig ? "mainnet" : "testnet";
  }

  return "testnet";
}

export function getNetworkConfig(chainId?: number): NetworkConfig | undefined {
  if (chainId === celoSepolia.id) return testnetConfig;
  if (chainId === celo.id && mainnetConfig) return mainnetConfig;
  if (!chainId) return testnetConfig;
  return undefined;
}

export function getSupportedChainIds(): number[] {
  const supported = [testnetConfig.id];
  if (mainnetConfig) supported.push(mainnetConfig.id);
  return supported;
}

export function isSupportedWalletNetwork(chainId?: number): boolean {
  if (!chainId) return false;
  return getSupportedChainIds().includes(chainId);
}

export function getTokenConfig(chainId: number, symbol: SupportedTokenSymbol): NetworkConfig["tokens"]["usdm" | "celo"] | undefined {
  const config = getNetworkConfig(chainId);
  if (!config) return undefined;
  if (symbol === "USDm") return config.tokens.usdm;
  return config.tokens.celo;
}

export function getExplorerUrlForChain(chainId?: number): string | undefined {
  const config = getNetworkConfig(chainId);
  return config?.explorerUrl;
}

export const supportedNetworkConfig = testnetConfig;
