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

export const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
] as const;

export * from "./addresses";
