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

The app is currently a Celo Sepolia testnet application. Mainnet remains disabled until the official smart-contract repository publishes verified Mainnet CeloHT and USDm deployment metadata.

To enable the official wallet-authenticated backend, set `NEXT_PUBLIC_BACKEND_URL` to a deployed `celoht-backend` URL. The frontend only sends public wallet addresses, nonce challenges, and wallet signatures; service-role credentials remain server-only in the backend.

## Controlled pilot setup

1. Deploy the app as a Next.js server, not GitHub Pages static export, so `/api/pilot/*` routes run.
2. Apply `supabase/migrations/20260909000000_notifications.sql`, then `supabase/migrations/20261030000000_pilot_pillars.sql` through the Supabase SQL editor or migration tooling.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, server-only `SUPABASE_SERVICE_ROLE_KEY`, and a strong random `PILOT_SESSION_SECRET`.
4. Use Celo Sepolia chain ID `11142220`. Do not enable a mainnet chain by changing the pilot environment.
5. Create approved courses, lessons, and passing-score values through an authorized database/admin workflow before using the pilot workspace.

The signed wallet session is HTTP-only. Database writes and privileged review actions are enforced in server routes; the service-role key must remain server-only.

Agent registry registration and planting financial records remain separate from database application/evidence records. Cash-in and cash-out are explicitly database-only simulations unless a confirmed existing contract workflow is implemented and disclosed.

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

The frontend is a static GitHub Pages application. It uses public RPCs and user wallet signatures directly, and can connect to the separately deployed official `celoht-backend` through `NEXT_PUBLIC_BACKEND_URL`. It never hosts or receives Supabase service operations, KYC secrets, evidence storage, or privileged administration credentials. Those states are shown as unavailable when the backend is not configured or healthy rather than fabricated.

See [CONTRACTS_SYNC.md](CONTRACTS_SYNC.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), and [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md).
