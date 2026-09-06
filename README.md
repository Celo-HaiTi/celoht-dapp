# CeloHT dApp

The official CeloHT frontend for wallet-connected education, agent registration, USDm reforestation contributions, and transparent network configuration.

## Source of truth

CeloHT Solidity contracts and deployments are maintained in [Celo-HaiTi/celoht-smart-contracts](https://github.com/Celo-HaiTi/celoht-smart-contracts). This repository does not contain a competing Solidity suite and does not deploy contracts.

The synchronized Celo Sepolia contracts are:

- `CeloHTAgentRegistry`
- `CeloHTServicePayments`
- `CeloHTEducation`
- `CeloHTReforestation`
- `CeloHTGovernance`

## Development

```bash
npm install
npm run dev
```

Before a pull request:

```bash
npm run contracts:sync
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

To refresh official deployment metadata and ABIs from a local checkout of the smart-contract repository:

```bash
OFFICIAL_CONTRACTS_PATH=/path/to/celoht-smart-contracts npm run contracts:sync-abis
```

## Network boundary

Celo Sepolia (`11142220`) is the only network with a synchronized CeloHT contract and USDm deployment in this repository. Celo Mainnet (`42220`) has no configured CeloHT contract or USDm deployment here, so those features remain unavailable until the official smart-contract repository publishes verified Mainnet metadata.

The frontend is a static GitHub Pages application. It can use public RPCs and user wallet signatures, but it cannot host server authentication, Supabase service operations, an event indexer, KYC, evidence storage, or privileged administration. Those states are shown as unavailable rather than fabricated.

See [CONTRACTS_SYNC.md](CONTRACTS_SYNC.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), and [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md).
