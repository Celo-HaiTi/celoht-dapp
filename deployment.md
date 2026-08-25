# Deployment

## Current Status

| Component                | Status                         |
| ------------------------ | ------------------------------ |
| Contracts (Celo Sepolia)  | Not yet deployed               |
| Contracts (Celo mainnet) | Not yet deployed               |
| Frontend                 | GitHub Pages deployment from `main` |

USDm is configured from verified token addresses: Celo Mainnet
`0x765DE816845861e75A25fCA122bb6898b8b1282a` and Celo Sepolia
`0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b`. Both contracts report symbol
`USDm` and 18 decimals via public Celo RPC reads.

`addresses.ts` intentionally holds the zero
address for every contract on every network until real deployments
happen, so the frontend never silently points at a nonexistent contract.

## Deploying Contracts

```bash
cp .env.example .env    # fill in DEPLOYER_PRIVATE_KEY, etc.
npm run deploy:sepolia
```

This runs [`deploy.ts`](deploy.ts),
which deploys all five contracts in dependency order and writes addresses
to `deployments/<network>.json`. A local network without `USDM_ADDRESS` set
may deploy a `MockERC20` for isolated tests. Celo Sepolia and Mainnet require
the real USDm contract address, or the script throws.

After deploying, sync the addresses into the frontend:

```bash
# from the repo root
npm run contracts:sync-abis
```

Then manually copy the addresses from
the deployment output into `addresses.ts` — this step is manual and
reviewed in a Pull Request deliberately, so a compromised deploy script
can't silently redirect the frontend to an attacker's contract.

### Deployment order and parameters

The deterministic order is:

1. `AgentRegistry(admin)`
2. `CertificateRegistry(admin)`
3. `ImpactRegistry(admin)`
4. `DonationManager(admin, USDM_ADDRESS, FEE_RECIPIENT_ADDRESS)`, followed by
    registration of `reforest-leogane-01` with `DONATION_RECIPIENT_ADDRESS` by
    the admin multisig when the deployer is a separate account
5. `GovernanceVoting(admin)`

`admin` must be an organization-controlled multisig. The deployer only pays for
deployment transactions; the script refuses to use the deployer as an implicit
admin or fee recipient. The project recipient is explicit and enforced by
DonationManager for withdrawals.

## Verifying Contracts

```bash
cd packages/contracts
npx hardhat verify --network celoSepolia <address> <constructor arg 1> ...
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
- Configure the verified `NEXT_PUBLIC_USDM_MAINNET_ADDRESS` and `NEXT_PUBLIC_USDM_SEPOLIA_ADDRESS`
    values. Never reuse an address across networks. Contract deployment also requires `USDM_ADDRESS`.
- Copy reviewed contract addresses into `addresses.ts`.
- Configure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for QR/mobile wallet connections.
- Add an indexer or backend service before displaying CeloHT-specific transaction history.
- Add Supabase credentials and row-level security policies before enabling persistent profiles,
  agent applications, notifications, or donation records.
- Move admin actions behind server-side authorization before production use.
