# Deployment

## Current Status

| Component                | Status                         |
| ------------------------ | ------------------------------ |
| Contracts (Alfajores)    | Not yet deployed               |
| Contracts (Celo mainnet) | Not yet deployed               |
| Frontend                 | Not yet deployed to production |

`apps/web/src/lib/contracts/addresses.ts` intentionally holds the zero
address for every contract on every network until real deployments
happen, so the frontend never silently points at a nonexistent contract.

## Deploying Contracts

```bash
cd packages/contracts
cp .env.example .env    # fill in DEPLOYER_PRIVATE_KEY, etc.
npm run deploy:alfajores
```

This runs [`scripts/deploy.ts`](../packages/contracts/scripts/deploy.ts),
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
`packages/contracts/deployments/<network>.json` into
`apps/web/src/lib/contracts/addresses.ts` — this step is manual and
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

`apps/web` is a standard Next.js app with no special deployment
requirements — deploy to Vercel, or any platform that runs
`npm run build && npm run start`. See
[`docs/development.md`](development.md) for required environment
variables.

## Pre-Mainnet Checklist

      and a real certificate issuance
      address before running `deploy:celo`
      addresses — not left on the deployer key
