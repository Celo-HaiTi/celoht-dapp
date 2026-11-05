# CeloHT Production Readiness

## Executive Status

Repository: CeloHT dApp

Date: 2026-11-05

Final status: NOT READY — local tests, lint, typecheck, production builds, the contract snapshot, and the dependency audit pass. Commit `b7aaf39` is deployed to GitHub Pages; its live governance route and JavaScript bundle were verified. Current public backend health, CORS, authentication boundary, and governance read were verified; the governance API reports zero proposals. The indexer readiness result recorded on 2026-11-01 was 503, and wallet/transaction journeys remain unverified.

## Verification Matrix

| Area | Status | Evidence |
| --- | --- | --- |
| Build | VERIFIED WORKING | `npm run build` and `npm run build:custom-domain` completed on 2026-11-05; all 38 routes generated. The governance UI is deployed to GitHub Pages. |
| Typecheck / lint | VERIFIED WORKING | `npm run typecheck` and `npm run lint` passed on 2026-11-05. |
| Unit tests | VERIFIED WORKING | `npm test`: 33 passed, 0 failed on 2026-11-05. |
| Dependency audit | VERIFIED WORKING | `npm run audit`: 0 high-severity production vulnerabilities on 2026-11-05. |
| Sepolia network / contract snapshot | VERIFIED WORKING | Sepolia-only regression tests pass; `npm run contracts:sync` verifies five official ABIs. The session did not re-run on-chain RPC reads. |
| Wallet providers | IMPLEMENTED BUT NOT VERIFIED | Injected, WalletConnect/Valora, and MiniPay paths exist; no live wallet/device session was tested. WalletConnect requires a public project ID. |
| Backend health, public governance read, and CORS | VERIFIED WORKING | On 2026-11-05, health returned 200; credentialed CORS preflight returned 204 for `https://app.celoht.com`; governance returned chain `11142220`, manifest-matching governance/USDm addresses, and zero proposals. |
| Backend auth session | IMPLEMENTED BUT NOT VERIFIED | An unauthenticated profile read returned 401 with the expected CORS origin. No wallet signed in or session mutation was tested. |
| Indexer synchronization / dataset | BLOCKED BY BACKEND / INDEXER / CONTRACT | Last recorded check on 2026-11-01: `/readyz` returned 503 at head `40273483`; five deployed contracts lagged about 4.93M blocks, USDm remained at block 0, all six `lastSuccessfulSync` values were null, and AgentRegistry was in `error`. Not rechecked on 2026-11-05. |
| Production deployment | VERIFIED WORKING | Commit `b7aaf39` deployed successfully in GitHub Actions run `41953465971`; `https://app.celoht.com/governance/` returned 200 and its referenced JavaScript bundle contains the updated governance UI. Browser execution was not tested. |

## Feature Classification

| Feature | Status | Evidence / limitation |
| --- | --- | --- |
| Celo Sepolia network selection | VERIFIED WORKING | Resolver is now Sepolia-only even when mainnet-looking public environment values are set; regression test passes. |
| Backend request transport and response schemas | VERIFIED WORKING | Live reads pass the new per-route guards; mock tests cover malformed data, error mapping, bounded timeouts, safe GET retry, and write non-retry. |
| Configured contract addresses and selected read methods | VERIFIED WORKING | Read-only RPC confirmed code and successful calls for USDm decimals, agent fee/lookup, service price, education eligibility, reforestation totals/count, and governance fee. |
| Learn catalog and lesson pages | IMPLEMENTED BUT NOT VERIFIED | Static course content is present; production pages returned 200, but no browser journey was run. |
| Persisted learner progress | NOT IMPLEMENTED | Current Learn progress uses guest `localStorage`; backend progress is only surfaced in Pilot Center and could not be verified. |
| Wallet connection, switching, balances, and transactions | IMPLEMENTED BUT NOT VERIFIED | UI and transaction receipt handling exist; no wallet was connected and no transaction was submitted. |
| Agent self-status and registration | IMPLEMENTED BUT NOT VERIFIED | Contract reads/write flow exist; on-chain read methods were verified, but approval/registration transactions were not run. |
| Indexed agent directory and activity | BLOCKED BY BACKEND / INDEXER / CONTRACT | Registry does not expose a searchable profile directory; indexer/backend unavailable. |
| Reforestation contract totals and donation flow | IMPLEMENTED BUT NOT VERIFIED | Read methods succeeded; donation approval/write/receipt flow was not exercised. |
| Project feed, planting evidence, and contribution history | BLOCKED BY BACKEND / INDEXER / CONTRACT | Public routes respond but return no projects/evidence; contribution history depends on indexer-owned records. Evidence submission is documented as unavailable. |
| Governance proposal feed | IMPLEMENTED BUT NOT VERIFIED | The page reads the official API and checks chain ID plus governance/USDm addresses against the local Celo Sepolia manifest. Live API returned zero proposals; the deployed JavaScript bundle contains the new heading and empty-state text. Browser execution was not tested. |
| Governance voting | NOT IMPLEMENTED | This page is intentionally read-only; no wallet vote submission is offered. |
| Durable notifications | NOT IMPLEMENTED | Backend notification routes return 404 and are absent from its API contract; the dApp now keeps preferences/history local instead of issuing unsupported requests. |
| English, Haitian Creole, Spanish, and French translations | IMPLEMENTED BUT NOT VERIFIED | Translation resources and language tests exist; complete page-by-page localization was not tested. |

## Prioritized Remediation Plan

1. P0: Have the indexer owner diagnose the failed AgentRegistry cursor and catch up all six checkpoints to the confirmed head. Use the reviewed recovery diagnostics/migration 003 only when its guarded bootstrap conditions match; do not reset or manually advance checkpoints. Resolve and regression-test public health-error redaction.
2. P0: Populate canonical published course/project records through the authorized backend/admin workflow and verify that indexed transactions/evidence/proposals appear through the API. Do not seed demo data or reset checkpoints.
3. P1: Browser-test the read-only governance feed and its empty/error states. Do not implement vote submission until proposal eligibility, authorization, and transaction receipt behavior are verified.
4. P1: Connect lesson completion to the authenticated `/progress` API only after a wallet session and published backend lesson IDs are available; keep local progress clearly separate.
5. P1: Run browser wallet journeys and controlled Sepolia agent/donation transactions with a disposable funded test wallet.
6. P2: Verify locales/accessibility, then commit/push and deploy through the existing GitHub Pages workflow only after the external gates pass.

## Findings

### ID-001
- severity: P0
- file/path: [addresses.ts](addresses.ts), [lib/network/config.ts](lib/network/config.ts), [deployments/dapp-config.json](deployments/dapp-config.json)
- problem: The wallet connector was Sepolia-only, but the network resolver could enable Celo Mainnet from public environment variables.
- security/business impact: A production build could advertise a network outside the testnet-only pilot requirement.
- repair performed: Removed the mainnet resolver and made supported-chain resolution unconditionally return Celo Sepolia.
- verification performed: `tests/network-config.test.mjs` sets mainnet-looking public env values and confirms only chain `11142220` is supported; TypeScript check passes.
- remaining dependency: None for the network restriction; do not enable Mainnet for this pilot.

### ID-002
- severity: P0
- file/path: [lib/backend.ts](lib/backend.ts), [app/pilot/page.tsx](app/pilot/page.tsx), [.env.example](.env.example)
- problem: GitHub Pages is static; it relies on the separate backend. The API is now reachable at the configured custom domain, but the OpenAPI file is not served as `/openapi.json` or `/api-docs` and live authenticated routes were not exercised.
- security/business impact: Prevents unsafe browser-side secret handling and avoids fake or unauthorized access, but also means authenticated production features cannot be certified locally.
- repair performed: The Pages workflow now defaults `NEXT_PUBLIC_BACKEND_URL` to `https://api.celoht.com`; the centralized client uses bounded, status-aware requests and route-specific payload guards. Unsupported notification requests were removed.
- verification performed: `GET /api/v1/health` and service discovery return 200; CORS preflight from `https://app.celoht.com` returns 204 with credentials. Documented public reads return valid schemas but empty arrays; unauthenticated profile/agent/progress return 401. OpenAPI is available in the backend repository, not served at the probed docs paths.
- remaining dependency: Test wallet nonce/signature/session flows with a disposable wallet, populate canonical records through authorized backend workflows, and verify authenticated persistence. The source contract is documented in the official backend [OPENAPI.md](https://github.com/Celo-HaiTi/celoht-backend/blob/main/OPENAPI.md).

### ID-003
- severity: P1
- file/path: [lib/backend.ts](lib/backend.ts), [app/pilot/page.tsx](app/pilot/page.tsx), official backend API contract
- problem: The backend contract supports courses, lesson progress, applications, and read-only evidence metadata, but has no notification routes, no cash-service simulation, and no planting-evidence submission route; public course/project records currently return empty lists.
- security/business impact: These user journeys cannot be truthfully shown as operational or persisted.
- repair performed: Existing UI reports unavailable workflows instead of creating local records or asserting completion. The governance page now reads the official governance endpoint and only displays it when chain ID and both contract addresses match the checked-in Celo Sepolia deployment.
- verification performed: On 2026-11-05, live governance returned HTTP 200, chain `11142220`, governance address `0x7D384851FAbB912287206556479Dd30c740CAdA5`, USDm address `0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b`, and zero proposals; the addresses match both local deployment manifests. Regression test, typecheck, lint, tests, and custom-domain build pass. Browser rendering is unverified.
- remaining dependency: Authorized course/project records, authenticated wallet/session E2E, indexer history, and a supported evidence upload contract remain external requirements.

### ID-004
- severity: P2
- file/path: [Header.tsx](Header.tsx), [app/exchange/page.tsx](app/exchange/page.tsx)
- problem: The UI used stale language implying a demo or simulated mode in the wallet status and exchange page. This can mislead users about whether a live deployment is present.
- security/business impact: Misinformation risk and reduced trust in app status messaging.
- repair performed: Replaced demo wording with explicit wallet status and unavailable integration status wording.
- verification performed: Verified through direct source review and successful build/test run.
- remaining dependency: None in this repository; product messaging remains aligned with the explicitly unavailable state.

### ID-005
- severity: P2
- file/path: [tests/mock-data-guard.test.mjs](tests/mock-data-guard.test.mjs), [scripts/check-no-mock-data.mjs](scripts/check-no-mock-data.mjs)
- problem: There was no automated protection against production code importing prohibited mock/demo data modules.
- security/business impact: This could silently allow non-production data to be treated as authoritative.
- repair performed: Added a CI-safe guard and a matching unit test to detect forbidden mock/demo imports while allowing valid app data modules.
- verification performed: Executed the guard and the full test suite; the guard passed and the suite passed with 22 tests.
- remaining dependency: CI must keep this guard in place for all future changes.

## External Blockers

### Blocker 1
- exact requirement: Recover and synchronize all indexer targets, then verify the public monitoring response does not expose credential-bearing error details.
- exact external system required: `celoht-indexer` Render deployment and its operator-controlled logs/checkpoint data.
- why it cannot be completed locally: The last recorded safe-field inspection on 2026-11-01 showed `/readyz` HTTP 503, `ready=false`, chain `11142220`, six checkpoints with `lastSuccessfulSync=null`, approximately 4.93M-block lag for five contracts, USDm at block 0, and AgentRegistry at `35343239` with `syncStatus=error` (deployment block `35343240`). `/health` timed out. This was not rechecked on 2026-11-05. No secret/error field was printed. The canonical indexer audit flags possible unauthenticated health-detail disclosure.
- exact verification after recovery: Use operator-controlled diagnostics, apply reviewed guarded recovery only if its preconditions match, verify all cursors/last-success timestamps advance, then reconcile representative events with receipts and test sanitized health output.

### Blocker 2
- exact requirement: Publish real courses and reforestation projects in canonical records and populate indexed activity before users are told those feeds are live.
- exact external system required: Backend admin workflow and canonical Supabase data; course/project rows must be published through authorized operations.
- why it cannot be completed locally: Live public `GET /courses`, `/transactions`, `/reforestation`, `/reforestation/evidence`, and governance returned valid but empty data. No records were inserted or fabricated.
- exact verification after recovery: Confirm published records and indexed transaction/evidence/proposal rows appear through documented API reads and agree with verified chain state.

### Blocker 3
- exact requirement: Verify wallet lifecycle and controlled Sepolia transactions; connect Learn completion only when published backend lesson IDs and a user session exist.
- exact external system required: Disposable funded Celo Sepolia wallet/browser, configured WalletConnect project ID for QR/Valora, published course records, and a working authenticated session.
- why it cannot be completed locally: No wallet was connected and no transaction was signed; authenticated route checks were intentionally limited to expected 401 responses.
- exact verification after implementation: Browser E2E for language, connect/switch, balances, Learn, agent/reforestation/governance reads, supported transaction pending/confirmed/reverted states, and disconnect.

## Residual Risks

- Backend health, discovery, credentialed CORS, public route envelopes, and selected live payload schemas are verified; authenticated persistence/RLS and all mutation paths are not.
- The indexer's last recorded `/readyz` check (2026-11-01) was 503, with AgentRegistry errored and sync timestamps null; current status was not rechecked. The public health-detail redaction finding also needs regression verification.
- Courses, transactions, projects, evidence, and governance proposals currently have no published records in the live API responses.
- Notifications are local-only; the backend notification URLs return 404 and are no longer called.
- WalletConnect/Valora requires a production public project ID; no wallet was available for live testing.
- A local Next.js dev session logged an unhandled rejection during Wagmi config initialization (`removeListener` proxy invariant). The production build and static deployment passed, but browser JS execution was unavailable and the cause remains unverified.
- Transactions, role permissions, reverted transactions, and event indexing were not exercised.
- Automated dependency audit passes, but it is not an independent smart-contract security audit.
- Governance changes are deployed; successful asset delivery does not prove browser hydration or wallet workflows.

## Final Certification

NOT READY — frontend checks and the custom-domain build pass, and the governance page is deployed. Current backend health/CORS and the real empty governance API response are verified. The indexer status is unresolved (last recorded 503 on 2026-11-01), useful public datasets are empty, authenticated persistence and wallet/transaction workflows have not passed browser E2E, and the local Next dev wallet-runtime rejection needs investigation. Do not certify this as an operational pilot yet.
