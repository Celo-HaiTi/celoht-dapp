# Deployment Boundary

The dApp is a static Next.js export deployed by GitHub Actions to GitHub Pages. This repository does not deploy contracts, run a backend, host a database, or run an indexer.

## Verified network configuration

- Celo Mainnet: chain ID `42220`; no CeloHT contract or USDm deployment is configured here.
- Celo Sepolia: chain ID `11142220`; the five official CeloHT contracts and USDm address are synchronized from `Celo-HaiTi/celoht-smart-contracts`.

Use `npm run contracts:sync` to verify deployment metadata and ABIs. Do not edit addresses in React components and do not add deployment credentials to this repository.

## Frontend deployment

Both public origins use this same repository and exported application. Build the
GitHub Pages project path with `npm run build:github-pages`; build the custom
domain root with `npm run build:custom-domain`. The first emits links/assets
under `/celoht-dapp/`, while the second emits them at `/`.

`app.celoht.com` is served by the GitHub Pages workflow as a static export with
`public/CNAME`. GitHub Pages cannot run the pilot API. Authenticated workflows
must call the existing `celoht-backend` service, deployed separately from its
official Render blueprint. Use `api.celoht.com` as the backend custom domain so
the frontend and API remain same-site for the backend's secure session cookie.
Configure the backend to allow only `https://app.celoht.com`, then set the
GitHub Actions variable `NEXT_PUBLIC_BACKEND_URL` to `https://api.celoht.com`.

```bash
npm install
npm run contracts:sync
npm run typecheck
npm run lint
npm test
npm run build
```

GitHub Pages can serve wallet-connected reads and user-signed transactions. It cannot provide server-side authentication, privileged administration, PostgreSQL/Supabase operations, or an event indexer. Those capabilities require the separately deployed official backend, Supabase project, and indexer; they remain unavailable until those services pass their health checks.
