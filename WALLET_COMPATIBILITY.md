# Wallet Compatibility

| Capability | Implementation | Real-wallet verification |
| --- | --- | --- |
| WalletConnect QR and mobile handoff | Wagmi WalletConnect v2 connector | Not performed |
| Valora selection | WalletConnect wallet chooser | Not performed |
| MiniPay authorization | MiniPay-marked injected provider through Wagmi | Not performed |
| Session restore and disconnect | Shared Wagmi connection state | Not performed |
| Account and chain changes | Wagmi connector events | Not performed |
| Wrong-network handling | Sepolia-only config and explicit switch action | Not performed |
| Reads and balances | Viem/Wagmi against configured Sepolia RPC | Automated RPC evidence only; not a wallet test |
| Transaction signing and confirmation | Explicit wallet approval and receipt wait | No wallet transaction performed |

## Notes

- Unit tests and compilation do not establish interoperability with a live wallet application.
- WalletConnect, Valora, and MiniPay require real desktop/mobile sessions before they can be classified as verified.

## Status

This matrix describes implemented paths, not verified compatibility or production readiness. See [WALLET_CONNECTION_TEST_REPORT.md](WALLET_CONNECTION_TEST_REPORT.md) for deployment configuration and real-wallet checks.
