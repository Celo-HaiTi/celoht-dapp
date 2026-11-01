# CeloHT Wallet Integration

## Supported connection paths

 **MiniPay:** detected using Celo's documented `window.ethereum.isMiniPay === true` marker and connected through a MiniPay-targeted Wagmi injected connector.
 **Valora and other mobile wallets:** connected through Wagmi's WalletConnect v2 QR/deep-link flow. Valora is not affiliated with CeloHT.
 **Browser wallets:** the generic EIP-1193 injected connector remains available.

The application never requests, receives, or stores private keys or recovery phrases.

## Networks

 Celo Sepolia only: chain ID `11142220`, native currency CELO (18 decimals), RPC `https://forno.celo-sepolia.celo-testnet.org`, explorer `https://celo-sepolia.blockscout.com`.

The wallet UI detects unsupported networks and provides a switch-to-Celo action where the wallet supports programmatic switching. Transactions are blocked by the wallet screens until a supported Celo network is active.

## USDm

USDm is read from the centralized `addresses.ts` configuration. The configured contracts are:

 USDm and application contracts are read from the checked-in Celo Sepolia deployment manifest and ABI files. No Mainnet deployment is configured.

Both addresses were checked through public Celo RPC reads and report `USDm` with 18 decimals. The frontend uses `balanceOf`, `decimals`, and `transfer` through the ERC-20 ABI.

 Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` or its alias `NEXT_PUBLIC_REOWN_PROJECT_ID` in the build environment. `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is canonical; `NEXT_PUBLIC_REOWN_PROJECT_ID` is used only when the canonical variable is blank. If both are non-empty, they must match or WalletConnect is disabled. Create the ID at https://cloud.reown.com/ and authorize `https://app.celoht.com` and `http://localhost:3000` in the Reown project. Dashboard access was not available to verify those origins here.

 For GitHub Actions, configure either value under repository **Settings → Secrets and variables → Actions → Variables**. For Vercel, use **Project Settings → Environment Variables**; for Render, use the service **Environment** settings. Static exports require the variable at build time. The project ID is public client configuration, not a private credential.

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in the GitHub Pages build environment to enable WalletConnect QR/deep links. MiniPay does not require this value when the dApp is opened inside MiniPay.

Wallet balances and transaction receipts come from the connected wallet and Celo RPC. CeloHT-specific history, donation records, and authenticated application state require the separate backend/indexer described in the production deployment status report.
