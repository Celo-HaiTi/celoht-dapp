# Security Policy

Report vulnerabilities privately through GitHub Security Advisories. Do not include private keys, recovery phrases, API secrets, or database credentials in reports.

## Current controls

- Wallet signing is delegated to wagmi connectors; the frontend never requests or stores private keys.
- Contract addresses and ABIs come from the synchronized official deployment snapshot.
- CeloHT contract features fail closed when the active chain has no official deployment.
- USDm amounts use viem `bigint` parsing and receipt confirmation before success is shown.
- Agent identity/KYC is not stored on-chain by this frontend.
- Reforestation financial records are not interpreted as physical planting evidence.
- Privileged contract administration is not exposed as a browser feature.
- Backend sign-in uses a one-time server-issued nonce and wallet signature; the browser never receives Supabase service-role credentials.

## Known limitations

The static GitHub Pages app has no server nonce/signature session, indexer, database authorization layer, or admin API. It is not production-ready for persistent profiles, KYC, evidence workflows, or privileged operations. The official smart-contract repository and deployed contracts require their own independent security review.

Run `npm audit` before release. CI fails on high or critical production dependency findings. The current dependency graph and the official smart-contract deployment still require independent review before any production release.
