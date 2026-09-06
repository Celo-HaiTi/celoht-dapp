# Repository Product Readiness

This repository is a static frontend for testnet review. It is not a backend, indexer, contract deployment repository, KYC system, or production admin console.

The official contract source is `Celo-HaiTi/celoht-smart-contracts`; the synchronized Celo Sepolia deployment is verified by `npm run contracts:sync`.

Production blockers are documented in `PRODUCTION_READINESS.md`. The current dependency audit also reports unresolved high-severity findings and must be reviewed before production release.
