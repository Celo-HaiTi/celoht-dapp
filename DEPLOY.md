# Frontend Deployment

This repository builds a static Next.js export for GitHub Pages. It does not deploy CeloHT contracts.

## Local verification

```bash
npm install
npm run contracts:sync
npm run typecheck
npm run lint
npm test
npm run build
```

## GitHub Pages

Pushes to `main` run `.github/workflows/deploy-pages.yml`. The workflow installs dependencies, verifies synchronized official ABIs and deployment metadata, runs typecheck/lint/tests, performs the dependency audit, and builds the static export before deployment.

WalletConnect project identifiers and public RPC URLs are frontend configuration. Never add private keys, service-role keys, database passwords, or deployment credentials to workflow files or `.env` files.

## Backend limitation

GitHub Pages cannot host an API, PostgreSQL/Supabase server operations, blockchain indexer, wallet-authentication nonce service, or admin authorization. The application therefore does not claim persistent user records, live proposal indexing, KYC, physical-impact evidence, or privileged administration.
