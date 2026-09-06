# Deployment Boundary

The dApp is a static Next.js export deployed by GitHub Actions to GitHub Pages. This repository does not deploy contracts, run a backend, host a database, or run an indexer.

## Verified network configuration

- Celo Mainnet: chain ID `42220`; no CeloHT contract or USDm deployment is configured here.
- Celo Sepolia: chain ID `11142220`; the five official CeloHT contracts and USDm address are synchronized from `Celo-HaiTi/celoht-smart-contracts`.

Use `npm run contracts:sync` to verify deployment metadata and ABIs. Do not edit addresses in React components and do not add deployment credentials to this repository.

## Frontend deployment

```bash
npm install
npm run contracts:sync
npm run typecheck
npm run lint
npm test
npm run build
```

GitHub Pages can serve wallet-connected reads and user-signed transactions. It cannot provide server-side authentication, privileged administration, PostgreSQL/Supabase operations, or an event indexer. Those capabilities require separately deployed infrastructure and are intentionally shown as unavailable until configured.
