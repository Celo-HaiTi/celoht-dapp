import { readFileSync } from "node:fs";

const { celoSepolia } = await import("wagmi/chains");
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

export function resolveEnvironmentMode() {
  return "testnet";
}

export function getNetworkConfig(chainIdValue) {
  if (chainIdValue === celoSepolia.id) return testnetConfig;
  if (!chainIdValue) return testnetConfig;
  return undefined;
}

export function getSupportedChainIds() {
  return [testnetConfig.id];
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
