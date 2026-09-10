# CeloHT Production Readiness

## Repository

Name: `celoht-dapp`

Purpose: CeloHT DApp frontend for wallet-connected education, agent registration, USDm-backed reforestation contributions, governance visibility, and Celo network configuration.

## Repository Type

DApp

## Status

READY FOR TESTING

## What Works

- Build, lint, typecheck, and test suite all pass on the current checkout
- Celo Sepolia deployment metadata and ABIs are synchronized from the official smart-contract repository
- Wallet connectivity and network safeguards function as designed
- Agent registration uses the official `CeloHTAgentRegistry` flow
- USDm donation flow uses the official `CeloHTReforestation` flow
- Mainnet is intentionally kept unavailable until verified contract metadata exists
- The app clearly surfaces unavailable states instead of fabricating blockchain or physical-world results

## What Was Changed

- Upgraded the production Next.js stack from `16.2.11` to `16.3.4` and aligned `eslint-config-next` to the same version
- Added repository-level audit documentation in `AUDIT.md`
- Updated this readiness summary to reflect the current verified state and blockers

## Tests

Executed and passed:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Security

Completed checks:

- reviewed public env configuration and kept secrets out of the repository
- reviewed wallet/network handling and confirmed no private credentials are committed
- reviewed current dependency status through `npm audit --omit=dev --audit-level=high`

Outstanding security issue:

- production dependency audit still reports remaining high-severity transitive vulnerabilities in the walletconnect/reown/axios stack, so the repository cannot yet be claimed production-ready from a security perspective

## Deployment

Verified deployment information:

- `.github/workflows/deploy-pages.yml` exists and performs lint, typecheck, test, contract sync, build, and Pages deployment
- Celo Sepolia is the only configured network in the checked-in deployment metadata
- Mainnet remains deliberately unavailable until verified external deployment metadata is published
- GitHub Pages deployment is configured, but production usage of external backend/indexer features requires separate operational verification

## External Dependencies

- `Celo-HaiTi/celoht-smart-contracts` for official contract and USDm deployment metadata
- public Celo RPC endpoints
- optional deployed `celoht-backend` for authenticated APIs
- optional Supabase project for browser-side off-chain data

## P0

- No verified Celo Mainnet CeloHT or USDm deployment metadata exists in this repository
- Backend-authenticated capabilities remain unavailable until `NEXT_PUBLIC_BACKEND_URL` is configured and the backend health is validated
- Remaining production dependency audit vulnerabilities prevent a clean production security claim

## P1

- Governance indexing, notifications, evidence workflows, profile persistence, and course progress require external infrastructure that is not configured here
- Any production deployment beyond the existing testnet configuration requires independent verification of the external contract, backend, and deployment environment

## P2

- Consolidate operator-facing deployment and integration requirements into a single checklist
- Continue dependency hygiene and review the remaining moderate audit findings
- Add explicit health checks and verification steps for backend/indexer readiness before formal staging or production promotion

## Remaining Blockers

### What is missing

- Verified Celo Mainnet contract and USDm deployment metadata
- Configured and health-verified backend deployment
- Fully resolved production dependency audit findings

### Why it matters

These items are required to claim production readiness beyond the current testnet-safe configuration.

### What is required

- Publish or verify official Celo Mainnet CeloHT contract metadata in the smart-contract repository
- Deploy and validate the backend/indexer environment
- Resolve or justify the remaining production dependencies and re-run the audit

## Evidence

- `package.json`: current scripts and dependency versions
- `deployments/dapp-config.json`: synchronized Sepolia deployment snapshot
- `addresses.ts`: enforced Sepolia-only contract/USDM configuration
- `lib/network/config.ts`: testnet-safe network resolution logic
- `.github/workflows/deploy-pages.yml`: CI/CD and deployment verification path
- `AUDIT.md`: current repository audit summary
- verification logs from `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev --audit-level=high`
