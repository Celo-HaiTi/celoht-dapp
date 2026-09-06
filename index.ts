import { erc20Abi, type Abi } from "viem";
import CeloHTAgentRegistryAbi from "./abis/CeloHTAgentRegistry.json";
import CeloHTServicePaymentsAbi from "./abis/CeloHTServicePayments.json";
import CeloHTEducationAbi from "./abis/CeloHTEducation.json";
import CeloHTReforestationAbi from "./abis/CeloHTReforestation.json";
import CeloHTGovernanceAbi from "./abis/CeloHTGovernance.json";

export const abis = {
  CeloHTAgentRegistry: CeloHTAgentRegistryAbi as Abi,
  CeloHTServicePayments: CeloHTServicePaymentsAbi as Abi,
  CeloHTEducation: CeloHTEducationAbi as Abi,
  CeloHTReforestation: CeloHTReforestationAbi as Abi,
  CeloHTGovernance: CeloHTGovernanceAbi as Abi,
} as const;

export { erc20Abi };
export * from "./addresses";
