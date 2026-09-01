# Contributing to the CeloHT dApp

Thanks for considering a contribution. This is a monorepo with two very
different halves — a Next.js frontend and a Solidity contracts package —
so please read the section relevant to what you're changing.

## Code of Conduct

Everyone participating in this project is expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Local Setup

```bash
git clone https://github.com/Celo-HaiTi/celoht-dapp.git
cd dapp
npm install
```

See [`docs/development.md`](docs/development.md) for environment variables
and the full local workflow.

## Contributing to the Frontend (`apps/web`)

```bash
cd apps/web
npm run dev
```

Before opening a PR:

```bash
npm run typecheck --workspace=apps/web
npm run lint --workspace=apps/web
npm run format:check
npm run build --workspace=apps/web
```

Standards:

- Server Components by default; add `"use client"` only when a component
  genuinely needs state, effects, or browser/wallet APIs.
- No placeholder content. If a page needs real data that isn't available
  yet, use the documented sample-data pattern in
  `apps/web/src/lib/data/README.md` — don't fabricate numbers and present
  them as live.
- Never describe CeloHT as a blockchain, token, ICO, or investment
  product, and never imply CeloHT owns or operates Valora.
- New pages: use the shared `PageHero`, `Section`, and `Breadcrumbs`
  components, and add the route to `apps/web/src/lib/nav.ts`.

## Contributing to the Contracts (`packages/contracts`)

```bash
cd packages/contracts
npm run compile
npm run test
npm run lint
```

Standards:

- Every new contract needs NatSpec comments, a matching interface where
  it makes sense, and a test file covering the happy path, access control,
  and pause behavior at minimum.
- Use the shared `Roles` library for access control identifiers instead
  of defining new ad hoc role constants.
- No contract in this repository issues, mints, or represents a token of
  CeloHT's own. If your change would do that, it doesn't belong here —
  open a Discussion first.
- After changing a contract's public interface, run
  `npm run contracts:sync-abis` from the repo root so the frontend's ABI
  copies stay in sync.

## Commit Style

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(web): add donation flow to the Donations page
fix(contracts): correct fee cap check in DonationManager
docs: update deployment guide for Alfajores
```

## Questions?

Open a [Discussion](https://github.com/celo-ht/celoht/discussions) on the
flagship repository, or see [`docs/community.md`](docs/community.md).
