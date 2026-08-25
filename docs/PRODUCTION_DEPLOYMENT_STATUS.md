# CeloHT Production Deployment Status

**Status: NOT READY**

This report records the repository audit performed before deployment work. It intentionally separates code that is present from infrastructure that is actually deployed.

## Current architecture

- **Frontend:** Next.js 16 App Router with static export for GitHub Pages.
- **Wallet:** wagmi + viem with injected wallets and optional WalletConnect. Connected wallet signs transactions client-side.
- **Networks:** Celo Mainnet (42220) and Celo Sepolia (11142220).
- **Token:** Official USDm configuration is centralized in `addresses.ts`; Mainnet and Sepolia addresses are configured separately.
- **Contracts:** Solidity contracts in `contracts/`, ABIs in `abis/`, Hardhat compilation/tests in the repository root.
- **Data:** Local typed course, agent, project, proposal, and partner fixtures exist for UI/content surfaces. There is no production database connection.
- **Deployment:** GitHub Pages workflow builds the static frontend. No backend, worker, indexer, or admin service is deployed from this repository.

## Existing functionality

- Wallet connection, disconnection, account/network detection, CELO balance reads, and QR receive flow.
- CELO native transfers and USDm ERC-20 transfer calls after explicit wallet approval.
- Address validation, zero-address rejection, decimal parsing, and balance checks before submission.
- Receipt tracking for submitted wallet transactions.
- Five Solidity contracts with local tests: AgentRegistry, CertificateRegistry, DonationManager, ImpactRegistry, and GovernanceVoting.
- Static application routes for wallet, transactions, education, agents, reforestation, donations, impact, profile, settings, and related pages.
- GitHub Pages deployment and public asset checks.

## Missing infrastructure

- No PostgreSQL/Supabase schema or migrations are connected to the application.
- No server-side API or `/api/health` endpoint exists.
- No blockchain indexer, block cursor, event store, retry worker, or reorg handling exists.
- No nonce/signature wallet authentication or server-side session exists.
- No server-side RBAC/admin authorization or audit-log service exists.
- No deployed CeloHT contract addresses are recorded for Celo Sepolia or Mainnet.
- No CeloHT contract source verification has been performed.
- No real Celo Sepolia acceptance transaction has been executed from this environment.

## Security risks and boundaries

- A static GitHub Pages frontend cannot safely provide server-side authentication, database access, admin authorization, or indexer execution.
- Client wallet connection is not proof of authenticated application identity until a nonce/signature backend is deployed.
- Local fixtures must not be used as live balances, transaction history, agent verification, donation totals, or environmental impact claims.
- The contracts are tested locally but unaudited and not production-deployed.
- Deployment private keys, explorer API keys, database credentials, and session secrets are external secrets and must never enter frontend variables or Git.

## Contract status

The contracts compile and have local unit coverage. They are **not deployed or verified** on Celo Sepolia or Celo Mainnet. Deployment must use a funded deployer wallet, an RPC endpoint, and a real USDm contract address for the selected network.

## Database/backend/indexer status

No production database, backend, indexer, authentication service, or admin service exists in this repository. These must be deployed outside GitHub Pages before the corresponding application flows can be enabled.

## Test status

- Frontend lint: available.
- Frontend TypeScript check: available.
- Hardhat compile: available.
- Local Solidity tests: available and currently passing.
- Real testnet acceptance: not run.
- Backend/database/indexer integration tests: not available because those services do not exist yet.

## Deployment status

- Frontend: GitHub Pages workflow exists.
- Celo Sepolia contracts: not deployed.
- Celo Mainnet contracts: not deployed.
- Backend/database/indexer/auth/admin: not deployed.

## Ordered production checklist

- [x] Phase 0 repository audit recorded.
- [x] Phase 1 deployment preparation and deterministic scripts. Local deployment was executed successfully; manifests write inside the repository and contain real local addresses only during the test run.
- [ ] Phase 2 deploy required CeloHT contracts to Celo Sepolia.
- [ ] Phase 3 verify deployed contracts on the explorer.
- [ ] Phase 4 provision PostgreSQL/Supabase and run migrations.
- [ ] Phase 5 deploy backend API and health checks.
- [ ] Phase 6 deploy restart-safe blockchain indexer.
- [ ] Phase 7 activate nonce/signature wallet authentication.
- [ ] Phase 8 activate server-side admin authorization and audit logs.
- [ ] Phase 9 connect frontend to deployed services.
- [ ] Phase 10 complete real Celo Sepolia acceptance tests.
- [ ] Phase 11 complete security and reliability review.
- [ ] Phase 12-16 prepare and execute Mainnet deployment and smoke tests.
- [ ] Phase 17 issue production certification.

## Exact external blockers

### Phase 2: funded deployment wallet and RPC

Required values/actions:

- `DEPLOYER_PRIVATE_KEY` for a funded deployment wallet, entered only into a secure local/CI secret store.
- `CELO_SEPOLIA_RPC_URL` with network access.
- `USDM_ADDRESS` set to the verified Sepolia USDm address.
- `FEE_RECIPIENT_ADDRESS` for DonationManager, reviewed by the organization.

Expected result: five CeloHT contracts deploy to chain ID 11142220 and produce real addresses, transaction hashes, and blocks.

### Phase 3: explorer verification

Required values/actions:

- `CELOSCAN_API_KEY` or the current Celo-compatible verification credential.
- Real deployment output from Phase 2.

Expected result: every deployed contract reports verified source and matching constructor arguments.

### Phase 4-8: hosted infrastructure

Required values/actions:

- PostgreSQL/Supabase project and migration permissions.
- Backend hosting account and server-side secrets.
- Indexer worker hosting and RPC access.
- Authentication/session secret and an organization-controlled admin wallet.

Expected result: persistent data, authenticated API requests, indexed blockchain events, and backend-enforced roles.

## Final verification status

The repository is currently **NOT READY FOR PRODUCTION**. The frontend and local contracts are testable, and Phase 1 deployment preparation is complete. Work is stopped at Phase 2 until a funded Celo Sepolia deployment wallet, secure RPC access, and organization-approved deployment parameters are supplied.
