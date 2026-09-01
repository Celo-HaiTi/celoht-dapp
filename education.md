# Education

## In the dApp

The Education section (`/education`, `/education/courses`) presents
CeloHT's core curriculum — financial literacy, blockchain/Web3
fundamentals, hands-on Valora/USDm use, and crypto risk awareness — as
structured courses with progress tracking.

## How Completion Is Recorded

Completing a course is designed to trigger an on-chain certificate issued
by an address holding `ISSUER_ROLE` on `CertificateRegistry`, minted
directly to the learner's wallet as a soulbound (non-transferable)
ERC-721 token. See [`../packages/contracts/contracts/CertificateRegistry.sol`](../packages/contracts/contracts/CertificateRegistry.sol).

## Current Data Source

Course content is currently sample data (`apps/web/src/lib/data/courses.ts`),
mirroring the curriculum in the flagship repository's
[`docs/education.md`](https://github.com/Celo-HaiTi/celoht/blob/main/docs/education.md).
Production course content and quiz logic are designed to be served from
Supabase — see [`api.md`](api.md).

## Certificates Page

`/certificates` reads `CertificateRegistry.certificatesOf(address)` and
`courseIdOf(tokenId)` directly from the contract for the connected
wallet — this is real on-chain data, not sample data, once the contract
is deployed on the active network.
