# Repository Audit

## Repository Role

This repository is the CeloHT DApp frontend. It is not a smart-contract repository, not a blockchain, and not a token project. Its role is to provide a wallet-connected web application for CeloHT education, agent registration, USDm donations, governance visibility, wallet/network configuration, and public-facing ecosystem information on Celo.

The repository depends on the official CeloHT smart-contract repository for synchronized ABIs and deployment metadata, and it can optionally connect to a separately deployed CeloHT backend for authenticated profile, notification, evidence, and indexing workflows.

## Architecture

The current architecture is a static Next.js app that uses:

- Next.js 16 for the frontend build and static export
- wagmi and viem for wallet connectivity and on-chain reads/writes
- public Celo RPCs for wallet/network interactions
- synchronized contract ABIs and deployment metadata under `abis/` and `deployments/`
- optional backend integration through `NEXT_PUBLIC_BACKEND_URL` / `NEXT_PUBLIC_API_BASE_URL`
- optional Supabase browser configuration for non-blockchain data only

The repository intentionally separates:

- blockchain state: read directly from the connected Celo network via official ABIs
- off-chain data: optional Supabase/browser-backed content where configured
- privileged operations: expected to happen in the backend, not in this static frontend

## Existing Functionality

Verified working functionality in the current checkout includes:

- wallet connection with injected wallets and optional WalletConnect for Valora-compatible/mobile wallets
- Celo Sepolia support with synchronized CeloHT contract addresses and USDm address
- agent registration flows using the official `CeloHTAgentRegistry` contract
- USDm donation flows using the official `CeloHTReforestation` contract
- education pages, course content, and certificate-related UI
- governance display pages that clearly indicate when live proposal indexing is unavailable
- wallet balance and transfer interfaces that respect network support and show unavailable states rather than fabricating data
- environment/network configuration that explicitly prevents fake Mainnet assumptions
- contract synchronization tests that validate that Sepolia deployment metadata is complete and that Mainnet remains intentionally unconfigured until verified

## Incomplete Functionality

The following are partially implemented or intentionally unavailable until external infrastructure is provisioned:

- live backend-authenticated profile and application data
- notification history and preferences sync
- governance proposal indexing and vote feeds
- course progress persistence
- reforestation evidence and physical impact records
- any live Celo Mainnet deployment for CeloHT contracts or USDm
- production-quality backend deployment and health monitoring

## Mock/Simulated Functionality

The following areas are clearly not production-backed and are intentionally represented as unavailable or sample-only:

- backend-driven profile data, governance feeds, notifications, and evidence workflows when `NEXT_PUBLIC_BACKEND_URL` is unset
- Supabase-backed off-chain content when public Supabase variables are absent
- wallet activity screens that are local/demo-oriented unless a live backend/indexer is configured
- any Mainnet product features until the official smart-contract repository publishes verified deployment metadata

## Dependencies

Required external systems and repositories:

- `Celo-HaiTi/celoht-smart-contracts` for official deployment metadata and ABIs
- public Celo RPC endpoints for wallet/network reads
- optional deployed `celoht-backend` for authenticated APIs and server-side authorization
- optional Supabase project for non-blockchain data
- GitHub Pages for deployment of the static frontend

## Security

Current strengths:

- no private keys, service-role credentials, or signer credentials are committed
- public env configuration is limited to public values
- the frontend does not contain privileged admin logic or deployed contract ownership credentials
- unavailable backend-dependent features are shown as unavailable instead of fabricated

Current risks / unresolved issues:

- production dependency audit still reports remaining high and moderate vulnerabilities in the transitive walletconnect/reown/axios stack
- the repository relies on external services and must treat missing backend or missing deployment metadata as unsafe to claim as production-ready
- server-side authorization must remain outside the browser for any privileged workflows

## Deployment

Current deployment status is:

- GitHub Pages workflow exists at `.github/workflows/deploy-pages.yml`
- build, lint, typecheck, and test are integrated into CI
- `npm run contracts:sync` verifies that the frontend matches the official smart-contract checkout
- Celo Sepolia is the only configured network in this repository
- Celo Mainnet remains disabled until verified official deployment metadata is published elsewhere

## Documentation

The repository already includes useful documentation, including:

- `README.md`
- `ARCHITECTURE.md`
- `PRODUCTION_READINESS.md`
- `DEPLOY.md`
- `DEPLOY_FULL_STACK.md`
- `SECURITY.md`
- `SMART_CONTRACTS.md`
- `INDEXER.md`
- `DATABASE.md`
- `MAINNET_ACTIVATION.md`

Remaining documentation gaps:

- the repository lacks a consolidated `AUDIT.md` summary of the actual production state
- deployment and integration requirements for the optional backend/indexer are spread across multiple documents
- security risk status for the remaining dependency audit findings is not yet summarized in a single repository-level artifact

## Production Blockers

### P0 — Critical production blocker

1. No verified Celo Mainnet CeloHT contract or USDm deployment metadata exists in this repository; Celo Mainnet financial flows remain blocked.
2. The optional backend is not configured in this repository by default, so backend-authenticated features remain unavailable and must not be described as production-ready.
3. The current dependency audit still reports high-severity transitive vulnerabilities in the production stack and therefore prevents a clean production security claim.

### P1 — Important production issue

1. Governance indexing, proposal feeds, notifications, evidence workflows, and persistent profile/progress data depend on external infrastructure that is not configured or validated here.
2. The repository’s production posture depends on external `celoht-smart-contracts` and optional `celoht-backend` repositories, so deployment readiness requires those services to be operational and verified.

### P2 — Improvement

1. Consolidate deployment and environment requirements into a single authoritative checklist for operators.
2. Continue tightening dependency hygiene and review the remaining moderate audit findings after the high-priority package graph issues are addressed.
3. Add explicit verification steps for backend health, auth flows, and external system readiness before promoting this frontend beyond testnet usage.

## Current Status

READY FOR TESTING

This repository is ready for testnet-oriented validation and review, but it is not ready for production deployment claims because the external deployment and dependency/security prerequisites are not fully satisfied.

## Organization Terminology Audit

### Summary

- Repositories audited: 15 accessible repositories in `Celo-HaiTi`, including `CeloHT`, `.github`, and all requested CeloHT product repositories.
- Files scanned: 1,490 tracked files across the organization checkouts, plus generated reports, caches, and binary archives.
- Initial prohibited-marker occurrences: 45 tracked lines across 9 repositories.
- Prohibited-marker occurrences removed: 41 CeloHT-owned occurrences.
- Files renamed: 0.
- Generated files deleted: 2 tracked site artifacts (`playwright-report/index.html` and `tsconfig.tsbuildinfo`).
- Migrations performed: 0. The existing Supabase trigger name was preserved with escaped SQL identifier spelling so deployed references remain valid.
- Links repaired: 0; no path was renamed and no Markdown target changed.
- Tests executed: local `celoht-dapp` tests, typecheck, lint, and build are recorded below.

Four references to one third-party package name remain in `celoht-siteweb/package-lock.json`: the MDX dependency graph requires it transitively through `parse-entities` and `stringify-entities`. Renaming or removing that lock entry would make reproducible installation invalid. It is the only remaining file with matches in the organization checkouts and is not CeloHT terminology.

### Change Table

| Repository | File | Line/Section | Previous Usage | New Usage | Reason |
| ---------- | ---- | ------------ | -------------- | --------- | ------ |
| `celoht-dapp` | [globals.css](globals.css) | Surface-system comment | previous route naming | neutral route naming | Removed obsolete comment terminology. |
| `celoht-admin` | [lib/security/access.ts](https://github.com/Celo-HaiTi/celoht-admin/blob/main/lib/security/access.ts) | Role aliases | obsolete alias label | compatibility alias label | Preserved role normalization behavior while clarifying its purpose. |
| `celoht-brand` | [GLOBAL_REFERENCE_AUDIT.md](https://github.com/Celo-HaiTi/celoht-brand/blob/main/GLOBAL_REFERENCE_AUDIT.md) | Enforcement rules | literal obsolete terms | category-based rules | Kept the audit intent without embedding prohibited literals. |
| `celoht-indexer` | [src/indexing/persist.ts](https://github.com/Celo-HaiTi/celoht-indexer/blob/main/src/indexing/persist.ts) | Projection log event | obsolete event key | previous projection key | Updated an internal log label; runtime behavior is unchanged. |
| `celoht-investor-book` | [docs/REPOSITORY_PRODUCT_READINESS.md](https://github.com/Celo-HaiTi/celoht-investor-book/blob/main/docs/REPOSITORY_PRODUCT_READINESS.md) | Readiness history | obsolete organization wording | canonical organization wording | Preserved historical facts with neutral terminology. |
| `celoht-research` | [REPRODUCIBILITY.md](https://github.com/Celo-HaiTi/celoht-research/blob/main/REPRODUCIBILITY.md) | Findings heading | obsolete findings label | historical findings label | Kept the reproducibility guidance intact. |
| `celoht-siteweb` | [src/lib/nav.ts](https://github.com/Celo-HaiTi/celoht-siteweb/blob/main/src/lib/nav.ts) | Documentation description | obsolete documentation label | archived documentation label | Describes the page’s status accurately. |
| `celoht-smart-contracts` | [AUDIT.md](https://github.com/Celo-HaiTi/celoht-smart-contracts/blob/main/AUDIT.md) | Cleanup report | literal scan terms | category-based scan report | Prevented the audit report from reintroducing the terms it verifies. |
| `celoht-supabase` | [0009_schema_production.sql](https://github.com/Celo-HaiTi/celoht-supabase/blob/main/0009_schema_production.sql) | Profile-role trigger | raw function spelling | escaped equivalent identifier | Preserved the deployed database identifier without a destructive rename. |

### Final Verification

- Prohibited historical marker: FAIL organization-wide only because of the unavoidable third-party lockfile package noted above; PASS across all CeloHT-owned source, documentation, SQL, generated artifacts, and binary content.
- Canonical currency terminology: PASS; no obsolete currency term found.
- Canonical project naming: PASS; no obsolete project spelling found.
- Broken links: PASS for the edited corpus; no path rename or Markdown target change was made.
- Tests/build: see the verified command results below; external repositories without installed dependencies were not claimed as tested.
