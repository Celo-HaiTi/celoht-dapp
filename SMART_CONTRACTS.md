# Smart Contracts

This repository does not contain or deploy the CeloHT Solidity contracts. The official source is [Celo-HaiTi/celoht-smart-contracts](https://github.com/Celo-HaiTi/celoht-smart-contracts).

The frontend consumes the official Celo Sepolia deployment snapshot and generated ABIs for:

- `CeloHTAgentRegistry`
- `CeloHTServicePayments`
- `CeloHTEducation`
- `CeloHTReforestation`
- `CeloHTGovernance`

Run `npm run contracts:sync` to verify the checked-in snapshot. Refresh it only from a checkout of the official repository with `OFFICIAL_CONTRACTS_PATH=/path/to/celoht-smart-contracts npm run contracts:sync-abis`. This process never deploys contracts.

The official repository currently targets Celo Sepolia (`11142220`) for the five CeloHT contracts. No Celo Mainnet CeloHT contract deployment is represented here, so those features remain unavailable on Mainnet.
