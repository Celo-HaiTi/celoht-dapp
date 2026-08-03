import type { Abi } from "viem";
import AgentRegistryAbi from "./abis/AgentRegistry.json";
import CertificateRegistryAbi from "./abis/CertificateRegistry.json";
import DonationManagerAbi from "./abis/DonationManager.json";
import ImpactRegistryAbi from "./abis/ImpactRegistry.json";
import GovernanceVotingAbi from "./abis/GovernanceVoting.json";

export const abis = {
  AgentRegistry: AgentRegistryAbi as Abi,
  CertificateRegistry: CertificateRegistryAbi as Abi,
  DonationManager: DonationManagerAbi as Abi,
  ImpactRegistry: ImpactRegistryAbi as Abi,
  GovernanceVoting: GovernanceVotingAbi as Abi,
} as const;

export * from "./addresses";
