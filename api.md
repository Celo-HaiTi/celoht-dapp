# Data API Boundaries

## Blockchain source of truth

Balances, allowances, transaction receipts, agent registry state, USDm donation totals, education eligibility, service configuration, and governance configuration come from the connected chain through the official generated ABIs.

## Backend source of truth

Profiles, course progress, indexed events, evidence records, and authentication are backend concerns. This repository has no server API or indexer. `lib/backend.ts` calls the official `celoht-backend` over HTTPS with credentialed requests; it never connects to Supabase directly and never receives service-role credentials. Configure `NEXT_PUBLIC_BACKEND_URL` in the GitHub Pages build and allow only `https://app.celoht.com` in the backend CORS origin.

## Synchronization

The official contract repository is the only contract source of truth. Run `npm run contracts:sync` to verify `deployments/dapp-config.json`, `deployments/celoSepolia.json`, and every ABI in `abis/`.

## Evidence

A USDm transfer is a financial record. It is not proof of planting, project completion, identity verification, or any physical-world outcome. Those records require a separately authenticated evidence and indexing system.
