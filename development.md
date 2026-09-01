# Development Guide

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/Celo-HaiTi/celoht-dapp.git
cd dapp
npm install
```

This installs dependencies for both `apps/web` and `packages/contracts`
via npm workspaces.

## Environment Variables

### Frontend (`apps/web/.env.local`)

Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in:

| Variable                                                     | Required?                      | Purpose                                         |
| ------------------------------------------------------------ | ------------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`                       | For WalletConnect/Valora       | From [cloud.reown.com](https://cloud.reown.com) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No — falls back to sample data | See [`api.md`](api.md)                          |
| `NEXT_PUBLIC_PINATA_JWT` or `NEXT_PUBLIC_WEB3_STORAGE_TOKEN` | No — not yet wired into the UI | IPFS pinning                                    |

### Contracts (`packages/contracts/.env`)

Copy `packages/contracts/.env.example` to `packages/contracts/.env`:

| Variable                             | Required?                     | Purpose                                       |
| ------------------------------------ | ----------------------------- | --------------------------------------------- |
| `DEPLOYER_PRIVATE_KEY`               | For any real deployment       | Defaults to Hardhat's public test key locally |
| `ALFAJORES_RPC_URL` / `CELO_RPC_URL` | No — public defaults provided |                                               |
| `CELOSCAN_API_KEY`                   | For contract verification     |                                               |

## Running Locally

```bash
# Frontend
cd apps/web
npm run dev              # http://localhost:3000

# Contracts (separate terminal)
cd packages/contracts
npx hardhat node          # local chain on http://127.0.0.1:8545
npm run deploy:localhost   # deploy the full suite locally
```

## Testing Checklist Before a PR

```bash
# From the repo root
npm run typecheck --workspace=apps/web
npm run lint --workspace=apps/web
npm run format:check
npm run build --workspace=apps/web
npm run contracts:compile
npm run contracts:test
```

All of the above run in CI on every Pull Request — see
`.github/workflows/`.

## Syncing ABIs After a Contract Change

```bash
npm run contracts:compile
npm run contracts:sync-abis
```

This copies the compiled ABI (never hand-typed) from
`packages/contracts/artifacts/` into `apps/web/src/lib/contracts/abis/`.

## Troubleshooting

**Wallet connect button doesn't do anything.** Check that
`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set if you're testing
WalletConnect specifically — an injected wallet (browser extension) works
without it.

**A page shows "isn't deployed on this network yet."** Expected until
real addresses are added to `apps/web/src/lib/contracts/addresses.ts` —
see [`deployment.md`](deployment.md).

**Build fails with a Radix/context-related error after adding a new UI
component.** Check that the component has a `"use client"` directive if
it uses any Radix primitive or React hook — see
[`../ARCHITECTURE.md`](../ARCHITECTURE.md#server-vs-client-components).
