import { celo, celoSepolia } from "wagmi/chains";
import type { Address } from "viem";
import { isAddress } from "viem";
import deploymentConfig from "./deployments/dapp-config.json";

/**
 * The Celo Sepolia address book is derived from the synchronized official
 * deployment manifest. Mainnet remains intentionally unconfigured here until
 * its official deployment manifest is verified.
 */
const configuredUsdmAddresses: Partial<Record<number, string>> = {
  // Mainnet remains unavailable until an official USDm deployment is verified.
  [celoSepolia.id]: deploymentConfig.celoSepolia.usdm,
};

export type ContractName =
  | "CeloHTAgentRegistry"
  | "CeloHTServicePayments"
  | "CeloHTEducation"
  | "CeloHTReforestation"
  | "CeloHTGovernance";

type AddressBook = Partial<Record<ContractName, Address>>;

function verifiedAddress(value: string): Address {
  if (!isAddress(value)) throw new Error(`Invalid official contract address: ${value}`);
  return value;
}

const configuredContractAddresses: Partial<Record<number, AddressBook>> = {
  [celoSepolia.id]: {
    CeloHTAgentRegistry: verifiedAddress(deploymentConfig.celoSepolia.contracts.agentRegistry.address),
    CeloHTServicePayments: verifiedAddress(deploymentConfig.celoSepolia.contracts.servicePayments.address),
    CeloHTEducation: verifiedAddress(deploymentConfig.celoSepolia.contracts.education.address),
    CeloHTReforestation: verifiedAddress(deploymentConfig.celoSepolia.contracts.reforestation.address),
    CeloHTGovernance: verifiedAddress(deploymentConfig.celoSepolia.contracts.governance.address),
  },
};

export const contractAddresses: Record<number, AddressBook> = {
  [celoSepolia.id]: configuredContractAddresses[celoSepolia.id] ?? {},
  [celo.id]: configuredContractAddresses[celo.id] ?? {},
};

export function getContractAddress(chainId: number, contract: ContractName): Address | undefined {
  const address = contractAddresses[chainId]?.[contract];
  return address && isAddress(address) ? address : undefined;
}

export function isContractDeployed(chainId: number, contract: ContractName): boolean {
  return getContractAddress(chainId, contract) !== undefined;
}

export function getUsdmAddress(chainId: number): Address | undefined {
  const configuredAddress = configuredUsdmAddresses[chainId];
  if (!configuredAddress || !isAddress(configuredAddress)) {
    return undefined;
  }
  return configuredAddress;
}

export function getTreasuryAddress(chainId: number): Address | undefined {
  const treasury = chainId === celoSepolia.id ? deploymentConfig.celoSepolia.generalTreasury : undefined;
  return treasury && isAddress(treasury) ? treasury : undefined;
}
