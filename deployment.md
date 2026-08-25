# Deployment

## Current Status

| Component                | Status                         |
| ------------------------ | ------------------------------ |
| Contracts (Alfajores)    | Not yet deployed               |
| Contracts (Celo mainnet) | Not yet deployed               |
| Frontend                 | GitHub Pages deployment from `main` |

`addresses.ts` intentionally holds the zero
address for every contract on every network until real deployments
happen, so the frontend never silently points at a nonexistent contract.

## Deploying Contracts

```bash
cp .env.example .env    # fill in DEPLOYER_PRIVATE_KEY, etc.
npm run deploy:alfajores
```

This runs [`deploy.ts`](deploy.ts),
which deploys all five contracts in dependency order and writes addresses
to `packages/contracts/deployments/<network>.json`. For Alfajores or a
local network without `USDM_ADDRESS` set, it deploys a `MockERC20` to
stand in for USDm — **never use this on mainnet**; mainnet deployment
requires the real USDm contract address, or the script throws.

After deploying, sync the addresses into the frontend:

```bash
# from the repo root
npm run contracts:sync-abis
```

Then manually copy the addresses from
the deployment output into `addresses.ts` — this step is manual and
reviewed in a Pull Request deliberately, so a compromised deploy script
can't silently redirect the frontend to an attacker's contract.

## Verifying Contracts

```bash
cd packages/contracts
npx hardhat verify --network alfajores <address> <constructor arg 1> ...
```

Requires `CELOSCAN_API_KEY` in `.env` — see
[`.env.example`](../packages/contracts/.env.example).

## Deploying the Frontend

This repository root is a standard Next.js app with no special deployment
requirements — deploy to Vercel, or any platform that runs
`npm run build && npm run start`. See
[`docs/development.md`](development.md) for required environment
variables.

## Activation Checklist

- Deploy and verify the five contracts on the intended network.
- Configure `NEXT_PUBLIC_USDM_ADDRESS` with the official USDm address for Celo Mainnet.
- Copy reviewed contract addresses into `addresses.ts`.
- Configure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for QR/mobile wallet connections.
- Add an indexer or backend service before displaying CeloHT-specific transaction history.
- Add Supabase credentials and row-level security policies before enabling persistent profiles,
  agent applications, notifications, or donation records.
- Move admin actions behind server-side authorization before production use.
