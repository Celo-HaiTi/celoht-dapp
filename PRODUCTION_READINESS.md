# Production Readiness

## TESTNET READY

The Celo Sepolia frontend is ready for testnet review. Mainnet financial use is **BLOCKED**.

## Verified

- Official Celo Sepolia deployment snapshot and five generated ABIs are synchronized.
- Celo Sepolia chain ID is `11142220`.
- Mainnet chain ID is `42220`; no CeloHT contract or USDm token address is configured there.
- Wallet reads and user-signed CELO/USDm transfers use receipt-based status handling.
- CeloHT donation and agent registration flows use USDm approval and confirmed official contract calls.
- No local contract deployment or competing Solidity architecture remains.

## BLOCKED

- No Celo Mainnet CeloHT contract deployment is provided by the official source repository.
- The official backend source exists, but no deployed backend URL is configured in this frontend by default. Proposal feeds, transaction history, profiles, course progress, and evidence require a healthy deployed backend/indexer.
- The backend provides nonce/signature authentication and privileged APIs, but those workflows remain unavailable until `NEXT_PUBLIC_BACKEND_URL` is configured and the backend environment is fully provisioned.
- KYC and reforestation evidence workflows are not implemented.
- Dependency audit findings remain and require review before a production release.
- The official smart-contract deployment itself needs independent operational and security review.
- CI contract synchronization now reads an explicit checkout of `Celo-HaiTi/celoht-smart-contracts`; it must not be replaced with the dApp checkout or a hand-edited ABI/address file.

The application must continue to show `Unavailable`, `Not configured`, or equivalent states for these capabilities. It must not manufacture blockchain or physical-impact data.
