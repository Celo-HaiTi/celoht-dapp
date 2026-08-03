import { celo, celoAlfajores } from "wagmi/chains";
import type { Address } from "viem";

/**
 * Deployed contract addresses per chain.
 *
 * Alfajores and Celo mainnet addresses are intentionally left as the zero
 * address until the contracts in packages/contracts are actually deployed
 * there (see docs/DEPLOYMENT.md and packages/contracts/scripts/deploy.ts).
 * Shipping a placeholder here — rather than a fabricated-looking real
 * address — avoids the frontend silently pointing at a contract that
 * doesn't exist.
 */
const ZERO_ADDRESS: Address = "0x0000000000000000000000000000000000000000";

export type ContractName =
  | "AgentRegistry"
  | "CertificateRegistry"
  | "DonationManager"
  | "ImpactRegistry"
  | "GovernanceVoting";

type AddressBook = Record<ContractName, Address>;

export const contractAddresses: Record<number, AddressBook> = {
  [celoAlfajores.id]: {
    AgentRegistry: ZERO_ADDRESS,
    CertificateRegistry: ZERO_ADDRESS,
    DonationManager: ZERO_ADDRESS,
    ImpactRegistry: ZERO_ADDRESS,
    GovernanceVoting: ZERO_ADDRESS,
  },
  [celo.id]: {
    AgentRegistry: ZERO_ADDRESS,
    CertificateRegistry: ZERO_ADDRESS,
    DonationManager: ZERO_ADDRESS,
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
