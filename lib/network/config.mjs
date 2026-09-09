import { readFileSync } from "node:fs";

const { celo, celoSepolia } = await import("wagmi/chains");
const deploymentConfig = JSON.parse(
  readFileSync(new URL("../../deployments/dapp-config.json", import.meta.url), "utf8"),
);

const configSource = deploymentConfig;

const testnetConfig = {
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
      address: configSource.celoSepolia?.usdm ?? undefined,
      explorerUrl: "https://celo-sepolia.blockscout.com/token/0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b",
    },
  },
  contracts: {
    agentRegistry: configSource.celoSepolia?.contracts?.agentRegistry?.address ?? undefined,
    servicePayments: configSource.celoSepolia?.contracts?.servicePayments?.address ?? undefined,
    education: configSource.celoSepolia?.contracts?.education?.address ?? undefined,
    reforestation: configSource.celoSepolia?.contracts?.reforestation?.address ?? undefined,
    governance: configSource.celoSepolia?.contracts?.governance?.address ?? undefined,
  },
};

const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
const configuredNetwork = process.env.NEXT_PUBLIC_CELO_NETWORK?.trim().toLowerCase();
const chainId = Number(process.env.NEXT_PUBLIC_CELO_CHAIN_ID ?? "");
const hasMainnetRpc = Boolean(process.env.NEXT_PUBLIC_CELO_RPC_URL?.trim());
const hasMainnetUsdm = Boolean(process.env.NEXT_PUBLIC_USDM_ADDRESS?.trim());

const mainnetConfig = ((appEnv === "mainnet" || configuredNetwork === "mainnet" || configuredNetwork === "celo") && chainId === celo.id && hasMainnetRpc && hasMainnetUsdm)
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
          address: process.env.NEXT_PUBLIC_USDM_ADDRESS?.trim() || undefined,
          explorerUrl: process.env.NEXT_PUBLIC_CELO_EXPLORER_URL?.trim() ? `${process.env.NEXT_PUBLIC_CELO_EXPLORER_URL.trim()}/token/${process.env.NEXT_PUBLIC_USDM_ADDRESS}` : undefined,
        },
      },
      contracts: {
        agentRegistry: process.env.NEXT_PUBLIC_CELOHT_AGENT_REGISTRY_ADDRESS?.trim() || undefined,
        servicePayments: process.env.NEXT_PUBLIC_CELOHT_SERVICE_PAYMENTS_ADDRESS?.trim() || undefined,
        education: process.env.NEXT_PUBLIC_CELOHT_EDUCATION_ADDRESS?.trim() || undefined,
        reforestation: process.env.NEXT_PUBLIC_CELOHT_REFORESTATION_ADDRESS?.trim() || undefined,
        governance: process.env.NEXT_PUBLIC_CELOHT_GOVERNANCE_ADDRESS?.trim() || undefined,
      },
    }
  : undefined;

export function resolveEnvironmentMode() {
  const appEnvLocal = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
  const networkName = process.env.NEXT_PUBLIC_CELO_NETWORK?.trim().toLowerCase();

  if (networkName === "mainnet" || appEnvLocal === "mainnet") return mainnetConfig ? "mainnet" : "testnet";
  if (networkName === "celo" || appEnvLocal === "production") return mainnetConfig ? "mainnet" : "testnet";
  return "testnet";
}

export function getNetworkConfig(chainIdValue) {
  if (chainIdValue === celoSepolia.id) return testnetConfig;
  if (chainIdValue === celo.id && mainnetConfig) return mainnetConfig;
  if (!chainIdValue) return testnetConfig;
  return undefined;
}

export function getSupportedChainIds() {
  const supported = [testnetConfig.id];
  if (mainnetConfig) supported.push(mainnetConfig.id);
  return supported;
}

export function isSupportedWalletNetwork(chainIdValue) {
  if (!chainIdValue) return false;
  return getSupportedChainIds().includes(chainIdValue);
}

export function getTokenConfig(chainIdValue, symbol) {
  const config = getNetworkConfig(chainIdValue);
  if (!config) return undefined;
  if (symbol === "USDm") return config.tokens.usdm;
  return config.tokens.celo;
}

export function getExplorerUrlForChain(chainIdValue) {
  const config = getNetworkConfig(chainIdValue);
  return config?.explorerUrl;
}

export const supportedNetworkConfig = testnetConfig;
