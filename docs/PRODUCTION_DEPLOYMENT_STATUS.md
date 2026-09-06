# Production Deployment Status

## Frontend

The static frontend can be reviewed on GitHub Pages and can connect to public Celo RPC endpoints through wagmi. User-signed wallet transfers and synchronized CeloHT Sepolia calls are receipt-based.

## Contracts

The official smart-contract repository is `Celo-HaiTi/celoht-smart-contracts`. This repository consumes its synchronized Celo Sepolia deployment snapshot and generated ABIs. It does not contain, compile, or deploy Solidity contracts.

## Not production-ready

There is no backend, indexer, server-side wallet authentication, KYC system, evidence store, or privileged administration API in this repository. Celo Mainnet has no official CeloHT contract deployment represented by the source repository currently used for synchronization. These limitations are intentionally surfaced in the UI and documented in `PRODUCTION_READINESS.md`.
