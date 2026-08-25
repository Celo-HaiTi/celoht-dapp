# CeloHT Production Readiness

## Current status

**Status: READY FOR TESTNET FRONTEND REVIEW, NOT READY FOR PRODUCTION FINANCIAL USE.**

The frontend has a real wagmi/viem wallet connection, live native CELO balance reads, QR receive flow, and signed CELO/ERC-20 transfer flows. It does not claim confirmation until the wallet transaction receipt is confirmed.

## Verified in this repository

- Celo Mainnet (chain ID 42220) and Celo Sepolia (11142220) are configured.
- The configured USDm contracts were read directly: both return `symbol=USDm` and `decimals=18`.
- CELO reads and transfers use the connected wallet and Celo RPC.
- ERC-20 reads/transfers use a network-specific USDm address configuration.
- Contract unit tests pass for the five Solidity contracts.
- All application routes build as a static GitHub Pages export.
- The UI does not display sample transaction records as live wallet activity.

## Still required before production

1. Verify transfer/allowance behavior with controlled wallet transactions on the chosen network. The addresses and metadata are verified: Mainnet is `0x765DE816845861e75A25fCA122bb6898b8b1282a`; Celo Sepolia is `0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b`; both report `USDm` with 18 decimals.
2. Deploy and verify the CeloHT contracts, then review the addresses into `addresses.ts`.
3. Deploy a server-side API, PostgreSQL/Supabase database, and blockchain indexer. GitHub Pages cannot host these services.
4. Add nonce/signature authentication and server-side roles before enabling agent, donation, admin, or persistent profile actions.
5. Run an independent smart-contract and application security review. The contracts in this repository are unaudited.

## Truthfulness rule

Until the external requirements above are complete, the application must show `Unavailable` or a clearly scoped configuration state. It must not create fake balances, transaction hashes, agent verification, tree totals, donation receipts, or admin authorization.
