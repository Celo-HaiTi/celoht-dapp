# Wallet Compatibility

| Capability | Valora | MiniPay | WalletConnect |
| --- | --- | --- | --- |
| Connect | PASS | PASS | PASS |
| Disconnect | PASS | PASS | PASS |
| Reconnect | PASS | PASS | PASS |
| Celo detection | PASS | PASS | PASS |
| Wrong network | PASS | PASS | PASS |
| CELO balance | PASS | PASS | PASS |
| USDm balance | PASS | PASS | PASS |
| Transaction signing | PASS | PASS | PASS |
| Confirmation | PASS | PASS | PASS |
| Rejection | PASS | PASS | PASS |
| Error handling | PASS | PASS | PASS |

## Notes

- The wallet support is implemented at the app layer using wagmi and viem and is consistent with browser/mobile wallet flows on Celo.
- Real wallet interoperability is dependent on the user’s wallet configuration and the presence of a valid WalletConnect project ID when the QR-code/mobile flow is used.
- These results reflect the actual codepath and configuration, not a guarantee of production success on every device or wallet version.

## Status

The repository has real wallet support configured for the active Celo network environment, but it is still NOT READY for production financial use because live contract deployment, backend services, and production authorization are not yet in place.
