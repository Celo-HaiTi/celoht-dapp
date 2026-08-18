# Architecture

## Overview

The CeloHT dApp is a monorepo with two independently deployable halves
that communicate only through public contract ABIs and addresses — never
a shared runtime.

```text
                    ┌─────────────────────────┐
                    │      Celo network         │
                    │  (mainnet / Alfajores)     │
                    └────────────▲───────────────┘
                                 │ read/write via wagmi + viem
                    ┌────────────┴───────────────┐
                    │     apps/web (Next.js)       │
                    │  wallet connect, UI, pages     │
                    └────────────▲───────────────┘
                                 │ ABIs synced via scripts/sync-abis.mjs
                    ┌────────────┴───────────────┐
                    │  packages/contracts (Hardhat) │
                    │  5 Solidity contracts, tests   │
                    └─────────────────────────────┘
```

## `packages/contracts`

| Contract                  | Purpose                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| `AgentRegistry.sol`       | Self-registration and coordinator-approved status for community agents      |
| `CertificateRegistry.sol` | Soulbound ERC-721 education certificates                                    |
| `DonationManager.sol`     | ERC-20 (USDm) donations earmarked per project, with a fee hard-capped at 5% |
| `ImpactRegistry.sol`      | Verifier-recorded reforestation planting records                            |
| `GovernanceVoting.sol`    | Role-based, one-address-one-vote proposals — no token                       |

Shared code lives in `contracts/libraries/` (`Roles.sol` for AccessControl
role identifiers, `BasisPoints.sol` for fee math) and
`contracts/interfaces/` (one interface per contract, used for typing and
documentation). See [`docs/technology.md`](docs/technology.md) for why
each design choice was made.

## `apps/web`

```text
apps/web/src/
├── app/                 # One folder per route (App Router)
├── components/
│   ├── ui/               # Hand-authored shadcn/ui-style primitives
│   └── web3/               # Wallet-specific components
├── lib/
│   ├── web3/                # wagmi config, chains, client-only provider gate
│   ├── contracts/             # ABIs (synced from packages/contracts) + addresses
│   ├── data/                    # Documented sample data (see its own README)
│   └── supabase/                  # Optional off-chain data client
```

### Why some UI components are hand-authored, not `shadcn add`-generated

`shadcn/ui`'s CLI fetches component source from its own registry
(`ui.shadcn.com`), which isn't reachable from every build/CI environment
without extra network allowances. The components in `src/components/ui/`
are written in the exact same style shadcn generates — Radix primitives,
Tailwind classes, `class-variance-authority` for variants — so switching
to the CLI later is a drop-in change, not a rewrite.

### Why wallet code is loaded client-only

`@wagmi/connectors`'s single barrel export pulls in every connector,
including ones (like Coinbase's Smart Wallet connector) this app doesn't
use, some of which assume a browser environment. Rather than depend on
every transitive package resolving cleanly during server-side rendering,
`Web3Gate.tsx` and the wallet-connect button are loaded via
`next/dynamic(..., { ssr: false })`, so wallet code only ever runs in the
browser — which is also where it's actually useful.

### Server vs. Client Components

Pages default to Server Components. `"use client"` is added only where a
component needs wagmi hooks, browser storage, or interactive state. Any
UI primitive that depends on React context at runtime (e.g. `Button`,
which uses Radix's `Slot`) is marked `"use client"` explicitly — omitting
that directive causes a hard build failure when the component is used
from a Server Component, because Next's server-side React build doesn't
expose `createContext` and similar client-only APIs.

## Data Flow

1. **On-chain data** (agent status, certificates, donation totals,
   planting records, votes) is read directly from contracts via wagmi
   hooks (`useReadContract`, `useReadContracts`) — no backend in between.
2. **Off-chain data** (course content, extended profiles, partner
   directory) is designed to come from Supabase — see
   [`docs/api.md`](docs/api.md) — but the UI runs on documented sample
   data (`src/lib/data/`) when Supabase isn't configured, so it's fully
   reviewable without provisioning a database.
3. **Evidence and metadata** (planting photos, agent profile details,
   certificate metadata) are designed to be pinned to IPFS and referenced
   on-chain by URI — see [`docs/api.md`](docs/api.md).

## Security Headers

See `apps/web/next.config.ts` for the Content Security Policy and
standard security headers, and [`SECURITY.md`](SECURITY.md) for the
reasoning behind the wallet-specific CSP tradeoffs.
