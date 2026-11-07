# CeloHT Ecosystem Readiness Audit

Audit date: 2026-11-07
Scope: public Celo-HaiTi repositories available from the organization, current local dApp worktree, public HTTP endpoints, and read-only Celo Sepolia RPC checks.

## Executive Result

**Overall: NOT READY.** Several code repositories pass their local tests and builds, and public dApp, website, and backend health URLs respond. This does not establish operational readiness: production datasets are empty, the Render indexer endpoint did not respond, one indexer database integration test failed in this environment, authenticated and wallet mutations were not exercised, and three repositories have critical/high production dependency advisories. No service was deployed or changed by this audit.

No private keys, recovery phrases, service credentials, or database credentials were requested or used. No production writes, wallet transactions, contract deployments, or governance actions were performed. A secret-free Render static-site blueprint was added to the dApp repository, but no service was deployed. Mainnet activation remains disabled pending required approvals and an independent contract audit.

## Repository Classification

| Repository | Status | Verified evidence and limitations |
| --- | --- | --- |
| `celoht-dapp` | BLOCKED | `npm ci`, lint, typecheck, 34 tests, both production builds, contract snapshot check, and mock-data guard pass. Production dependency audit finds zero advisories. Public app root returns 200. A Render static-site blueprint now publishes the existing custom-domain export. Browser, wallet, persisted-write journeys, and a Render deployment were not verified. |
| `celoht-siteweb` | FAIL | Lint, typecheck, 18 tests, 56-route production build, and brand-asset validation pass. Production dependency audit reports 2 high and 1 critical advisory. Its 177 configured Playwright cases could not launch because browser binaries are absent; no application assertions ran. |
| `celoht-backend` | BLOCKED | Lint, typecheck, 116 tests, build, mock guard, and production dependency audit pass. Public `/api/v1/health` returns 200/`healthy`; unauthenticated profile returns 401; credentialed CORS preflight returns 204 with the exact app origin. Authenticated mutations, database readiness, and the credentialed smoke script were not run. |
| `celoht-supabase` | BLOCKED | Static validation confirms 22 migrations, 43 required tables, and required RLS/idempotency safeguards. Disposable PostgreSQL migration/database verification passes. The live Supabase project, applied migration state, and production RLS were not inspected because no database credentials were available or requested. |
| `celoht-indexer` | FAIL | Lint, typecheck, 102 tests, build, mock guard, and read-only Sepolia RPC integration pass. RPC integration reported chain 11142220, head 40787325, five deployed contracts verified, zero governance logs, and 34 token transfer logs. PostgreSQL integration failed with `Connection terminated unexpectedly` during schema reset on a disposable DB. Render-default `/health` and `/readyz` probes timed out; live persistence and checkpoints are unverified. |
| `celoht-smart-contracts` | BLOCKED | Compile passes for 28 Solidity files; 109 Hardhat tests pass, including invariant/property cases; production mock guard and production dependency audit pass. Forge/Echidna were unavailable. No independent external security audit was evidenced, so this is not mainnet-ready. |
| `celoht-governance` | FAIL | Lint, typecheck, 35 unit tests, 8 security tests, TypeScript build, mock guard, and canonical Sepolia manifest validation pass. The declared integration script fails because `tests/integration` contains no matching test files. Live API proposal list is empty. |
| `celoht-admin` | FAIL | Lint, typecheck, 13 tests, build, and mock guard pass. Production dependency audit reports 5 high and 2 critical advisories. |
| `celoht-demo` | FAIL | Lint, typecheck, 3 tests, build, and production-mock guard pass. Production dependency audit reports 2 high and 1 critical advisory. This repository's tests explicitly classify its wallet/transaction flows as demo-only. |
| `CeloHT` | NOT TESTED | Public repository inventoried; no local build/test gate was run. |
| `celoht-brand` | NOT TESTED | Public repository inventoried; no build/test gate was run. |
| `celoht-docs` | NOT TESTED | Public repository inventoried; no documentation link/content audit was completed. |
| `celoht-research` | NOT TESTED | Public repository inventoried; no research/content audit was completed. |
| `celoht-investor-book` | NOT TESTED | Public repository inventoried; no content/claims audit was completed. |
| `Celo-HaiTi/.github` | NOT TESTED | Public repository inventoried; organization-level workflows and policies were not reviewed. |

## Test Results

`npm ci` succeeded for the dApp and each code-bearing repository with a package manifest. The active environment is Node 24.22.2; backend and indexer declare Node 22-only engines, so their successful local checks are not a substitute for running in the declared runtime.

| Repository | Results |
| --- | --- |
| dApp | 34/34 tests; lint, typecheck, `next build`, custom-domain build, contract sync, mock guard, and production audit pass. |
| Admin | 13/13 tests; lint, typecheck, build, and mock guard pass. |
| Backend | 116/116 tests; lint, typecheck, build, mock guard, and production audit pass. |
| Demo | 3/3 tests; lint, typecheck, build, and mock guard pass. |
| Governance | 35/35 unit and 8/8 security tests pass; integration command fails due to no test files; typecheck/build/manifest validation pass. |
| Indexer | 102/102 tests; lint, typecheck, build, mock guard, and RPC integration pass; PostgreSQL integration fails at disposable database schema reset. |
| Website | 18/18 tests; lint, typecheck, build, and brand assets pass; browser E2E is blocked by missing Playwright browsers. |
| Smart contracts | Compile passes; 109/109 Hardhat tests pass; mock guard and production dependency audit pass. |
| Supabase | 22-migration static check and mock guard pass; disposable PostgreSQL verification reports `database tests passed`. |

No authenticated production integration, browser-wallet transaction, production write, mobile-wallet session, or deployment smoke test was performed. Backend smoke tests require secret credentials and mutate a Redis counter, so they were intentionally not run against production.

## Live Endpoint Checks

| Endpoint | Result | Interpretation |
| --- | --- | --- |
| `https://app.celoht.com/` | HTTP 200 | Reachable; current commit delivery and browser hydration were not proven. |
| `https://celoht.com/` | HTTP 200 | Reachable; no full site E2E completed. |
| `https://api.celoht.com/api/v1/health` | HTTP 200, `healthy` | Backend liveness endpoint responds; this alone does not prove database or indexer readiness. |
| `https://api.celoht.com/api/v1/courses` | HTTP 200, 0 records | No published courses returned. |
| `https://api.celoht.com/api/v1/transactions` | HTTP 200, 0 records | No indexed transactions returned. |
| `https://api.celoht.com/api/v1/reforestation` | HTTP 200, 0 records | No published projects returned. |
| `https://api.celoht.com/api/v1/reforestation/evidence` | HTTP 200, 0 records | No evidence records returned. |
| `https://api.celoht.com/api/v1/governance` | HTTP 200, chain 11142220, 0 proposals | Response is on the expected test chain but has no proposals. |
| `https://api.celoht.com/api/v1/profile` without credentials | HTTP 401 | Protected route rejects an unauthenticated request. |
| CORS preflight from `https://app.celoht.com` | HTTP 204, credentials enabled, exact origin allowed | Preflight configuration is present for the app origin. |
| Render-default indexer `/health` and `/readyz` | Timed out | Render service availability/readiness could not be verified. |

The dApp repository's current deployment workflow still targets GitHub Pages. A Render static-site blueprint was added using the verified custom-domain build output and official backend URL, but it does not attach or migrate `app.celoht.com`. The public domain responds, but this audit did not prove a Render deployment. No deployment was performed.

## Dependency Findings

Production (`npm audit --omit=dev`) findings:

| Repository | Production findings |
| --- | --- |
| `celoht-admin` | 9 total: 2 moderate, 5 high, 2 critical. Includes `next` (critical), `dompurify` (critical), `vite`, `zod`, `undici`, and `sharp`. |
| `celoht-demo` | 3 total: 2 high, 1 critical. Includes `next` (critical), `sharp`, and `source-map-js`. |
| `celoht-siteweb` | 3 total: 2 high, 1 critical. Includes `next` (critical), `sharp`, and `source-map-js`. |
| `celoht-dapp`, backend, governance, indexer, smart contracts, Supabase | 0 production advisories at audit time. |

Additional development-only advisories were reported by full `npm audit` in several repositories. In particular, smart-contracts reports 60 total findings, all from its development dependency graph according to the production-only audit. These findings still require a separately planned dependency update and retest. No forced upgrades were applied.

## Blockers and Owner Actions

1. Update and retest vulnerable production dependencies in admin, demo, and website, especially the affected Next.js versions; review the full dependency trees before merging. Do not treat `npm audit fix --force` as an acceptable remediation without compatibility review.
2. Run backend/indexer on their declared Node 22 runtime and complete their real deployment checks.
3. Repair or diagnose the indexer disposable-Postgres integration failure, then run its Postgres recovery/reorg suite. Verify the deployed indexer's `/readyz`, checkpoint freshness, persisted event counts, duplicate handling, and reorg recovery using operator-controlled logs and database access.
4. Review the governance integration script/test layout and add or correct the intended integration tests; do not report the empty target as passing.
5. Publish only authorized canonical course/project/proposal records. Reconcile them with database and chain evidence; do not seed fabricated activity or impact metrics.
6. Run authenticated backend, RLS, wallet-auth, mobile wallet, and transaction lifecycle tests in a disposable/authorized environment. Use a disposable funded Sepolia test wallet; never share its private key or recovery phrase.
7. Approve and execute the migration from the current Pages workflow to the prepared Render blueprint, including custom-domain routing and rollback ownership. Verify the actual Render deployment and live browser behavior before claiming deployment success.
8. Complete independent external smart-contract security audits and resolve findings before any mainnet consideration. Keep unapproved mainnet operations disabled. Governance Council remains the highest ongoing collective decision-making body.
9. Finish content/policy, workflow, and security audits for the repositories marked NOT TESTED, plus organization-level GitHub configuration.

## Final Acceptance

**Overall status: NOT READY.** Local build/test success is useful evidence but does not close the live-data, indexer persistence, dependency security, browser E2E, authenticated workflow, Render deployment, or external-audit gates. Celo Sepolia remains the only verified chain target in the tested contract/dApp paths. Mainnet readiness: **FAIL / approval gates incomplete**. External audit: **BLOCKED / not evidenced**.
