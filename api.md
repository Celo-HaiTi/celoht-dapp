# Data API Boundaries

## Blockchain source of truth

Balances, allowances, transaction receipts, agent registry state, USDm donation totals, education eligibility, service configuration, and governance configuration come from the connected chain through the official generated ABIs.

## Backend source of truth

Profiles, course progress, indexed events, evidence records, and authentication are backend concerns. This repository has no server API or indexer. `client.ts` can create a Supabase browser client only when public URL and anonymous key variables are configured; it never uses service-role credentials.

## Synchronization

The official contract repository is the only contract source of truth. Run `npm run contracts:sync` to verify `deployments/dapp-config.json`, `deployments/celoSepolia.json`, and every ABI in `abis/`.

## Evidence

A USDm transfer is a financial record. It is not proof of planting, project completion, identity verification, or any physical-world outcome. Those records require a separately authenticated evidence and indexing system.
