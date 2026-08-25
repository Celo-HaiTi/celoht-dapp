# CeloHT Wallet Integration

## Supported connection paths

- **MiniPay:** detected through the injected provider's `isMiniPay` flag and connected through wagmi's injected connector.
- **Browser EVM wallet:** connected through wagmi's injected connector when an injected provider is available.
- **Valora and other mobile wallets:** connected through the WalletConnect connector. The wallet modal is available only when `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is configured; the connector opens WalletConnect's QR/deep-link flow.

The application never requests, receives, or stores private keys or recovery phrases.

## Networks

- Celo Mainnet: chain ID `42220`.
- Celo Sepolia: chain ID `11142220`.

The wallet UI detects unsupported networks and provides a switch-to-Celo action where the wallet supports programmatic switching. Transactions are blocked by the wallet screens until a supported Celo network is active.

## USDm

USDm is read from the centralized `addresses.ts` configuration. The configured contracts are:

- Celo Mainnet: `0x765DE816845861e75A25fCA122bb6898b8b1282a`.
- Celo Sepolia: `0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b`.

Both addresses were checked through public Celo RPC reads and report `USDm` with 18 decimals. The frontend uses `balanceOf`, `decimals`, and `transfer` through the ERC-20 ABI.

## Required deployment configuration

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in the GitHub Pages build environment to enable WalletConnect QR/deep links. Injected MiniPay/browser wallets do not require this value.

Wallet balances and transaction receipts come from the connected wallet and Celo RPC. CeloHT-specific history, donation records, and authenticated application state require the separate backend/indexer described in the production deployment status report.
