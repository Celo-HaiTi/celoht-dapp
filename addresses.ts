import { celo, celoSepolia } from "wagmi/chains";
import type { Address } from "viem";
import { isAddress } from "viem";

/**
 * Deployed contract addresses per chain.
 *
 * CeloHT contracts remain undefined until they are actually deployed. USDm
 * uses the verified addresses supplied for Celo Mainnet and Celo Sepolia.
 */
const ZERO_ADDRESS: Address = "0x0000000000000000000000000000000000000000";
const configuredUsdmAddresses: Partial<Record<number, string>> = {
  [celo.id]: process.env.NEXT_PUBLIC_USDM_MAINNET_ADDRESS?.trim() || "0x765DE816845861e75A25fCA122bb6898b8b1282a",
  [celoSepolia.id]: process.env.NEXT_PUBLIC_USDM_SEPOLIA_ADDRESS?.trim() || "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b",
};

const configuredContractAddresses: Partial<Record<number, Partial<Record<ContractName, string>>>> = {
  [celo.id]: {
    DonationManager: process.env.NEXT_PUBLIC_DONATION_MANAGER_MAINNET_ADDRESS?.trim(),
  },
  [celoSepolia.id]: {
    DonationManager: process.env.NEXT_PUBLIC_DONATION_MANAGER_SEPOLIA_ADDRESS?.trim(),
  },
};

function configuredAddress(chainId: number, contract: ContractName): Address {
  const value = configuredContractAddresses[chainId]?.[contract];
  return value && isAddress(value) ? value : ZERO_ADDRESS;
}

export type ContractName =
  | "AgentRegistry"
  | "CertificateRegistry"
  | "DonationManager"
  | "ImpactRegistry"
  | "GovernanceVoting";

type AddressBook = Record<ContractName, Address>;

export const contractAddresses: Record<number, AddressBook> = {
  [celoSepolia.id]: {
    AgentRegistry: ZERO_ADDRESS,
    CertificateRegistry: ZERO_ADDRESS,
    DonationManager: configuredAddress(celoSepolia.id, "DonationManager"),
    ImpactRegistry: ZERO_ADDRESS,
    GovernanceVoting: ZERO_ADDRESS,
  },
  [celo.id]: {
    AgentRegistry: ZERO_ADDRESS,
    CertificateRegistry: ZERO_ADDRESS,
    DonationManager: configuredAddress(celo.id, "DonationManager"),
    ImpactRegistry: ZERO_ADDRESS,
    GovernanceVoting: ZERO_ADDRESS,
  },
};

export function getContractAddress(chainId: number, contract: ContractName): Address | undefined {
  const address = contractAddresses[chainId]?.[contract];
  return address && address !== ZERO_ADDRESS ? address : undefined;
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
