# Development

## Setup

```bash
npm install
npm run dev
```

## Validation

```bash
npm run contracts:sync
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

`npm run contracts:sync` verifies the checked-in official Celo Sepolia deployment snapshot and generated ABIs. To refresh from the official repository, set `OFFICIAL_CONTRACTS_PATH` and run `npm run contracts:sync-abis`. No deployment command exists in this repository.

## Public environment variables

Copy `.env.example` to `.env.local` for optional local configuration. WalletConnect, RPC, community links, and optional Supabase browser variables are public frontend configuration. Do not add private keys, service-role keys, deployment credentials, or database passwords.

## Architecture boundary

The frontend is a static GitHub Pages application. Backend authentication, Supabase server operations, event indexing, persistent records, and admin authorization must be provided by separately deployed services before those features are enabled.
