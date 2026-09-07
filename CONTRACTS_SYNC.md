# Contract Synchronization

The official source of truth is `Celo-HaiTi/celoht-smart-contracts`. The checked-in `deployments/dapp-config.json` and `deployments/celoSepolia.json` are the synchronized Celo Sepolia snapshot for chain `11142220`.

To verify the checked-in snapshot and generated ABIs:

```sh
npm run contracts:sync
```

To refresh the snapshot and ABIs from an official smart-contract checkout:

```sh
OFFICIAL_CONTRACTS_PATH=/path/to/celoht-smart-contracts npm run contracts:sync-abis
OFFICIAL_CONTRACTS_PATH=/path/to/celoht-smart-contracts npm run contracts:sync
```

The synchronization script copies the five ABI arrays from the official `deployments/dapp-config.json` into `abis/` and fails on a missing Celo Sepolia deployment, chain mismatch, missing ABI, or stale local file. In CI, `OFFICIAL_CONTRACTS_PATH` is mandatory and the workflow checks out `Celo-HaiTi/celoht-smart-contracts` separately, so CI cannot validate the snapshot against itself. It never deploys contracts or reads private deployment credentials.
