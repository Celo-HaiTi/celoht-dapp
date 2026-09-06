# Production Readiness

## Status

**Testnet frontend review: READY WITH LIMITATIONS. Mainnet financial use: NOT READY.**

## Verified

- Official Celo Sepolia deployment snapshot and five generated ABIs are synchronized.
- Celo Sepolia chain ID is `11142220`.
- Mainnet chain ID is `42220`; only the documented USDm token address is configured there.
- Wallet reads and user-signed CELO/USDm transfers use receipt-based status handling.
- CeloHT donation and agent registration flows use USDm approval and confirmed official contract calls.
- No local contract deployment or competing Solidity architecture remains.

## Blockers

- No Celo Mainnet CeloHT contract deployment is provided by the official source repository.
- No production indexer or backend exists for proposal feeds, transaction history, profiles, course progress, or evidence.
- No server nonce/signature authentication or privileged admin API exists.
- KYC and reforestation evidence workflows are not implemented.
- Dependency audit findings remain and require review before a production release.
- The official smart-contract deployment itself needs independent operational and security review.

The application must continue to show `Unavailable`, `Not configured`, or equivalent states for these capabilities. It must not manufacture blockchain or physical-impact data.
