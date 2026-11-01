# Wallet Connection Test Report

## Current implementation

- The app uses its existing Wagmi/Viem architecture and configures only Celo Sepolia (chain ID `11142220`).
- WalletConnect v2 uses Wagmi's supported connector and QR/deep-link modal. Valora uses the same wallet chooser and is not affiliated with CeloHT.
- MiniPay is detected only from the documented `window.ethereum.isMiniPay === true` marker plus an EIP-1193 `request` method, then connected using a dedicated Wagmi connector.
- Shared Wagmi state handles account changes, chain changes, reconnect, and disconnect across app routes.
- Writes and native transfers check the active chain and pass `chainId: 11142220` to Wagmi.
- No MiniPay provider, Reown dashboard, real wallet app, or production origin allowlist was available for live verification during implementation.

## Project ID and deployment

Set either or both (with equal values) of these public build-time variables:

```text
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<Reown project ID>
NEXT_PUBLIC_REOWN_PROJECT_ID=<same Reown project ID>
```

Create a project at https://cloud.reown.com/ and copy its 32-character Project ID. Invalid or conflicting values disable WalletConnect and Valora. Configure one value in GitHub Actions repository **Settings → Secrets and variables → Actions → Variables**, Vercel **Project Settings → Environment Variables**, or the Render service **Environment** settings. For static builds, it must be present at build time.

Add these allowed application origins in Reown Cloud:

```text
https://app.celoht.com
http://localhost:3000
```

The dashboard allowlist could not be inspected, so those origin permissions remain unverified. The Project ID is public configuration; never put private credentials in these variables.

The default Sepolia RPC is `https://forno.celo-sepolia.celo-testnet.org`; `NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL` can override it. The explorer and deployed addresses are sourced from the checked-in deployment manifest.

## Verification classification

- `npm run typecheck`, `npm run lint`, `npm test` (28/28), and `npm run build:custom-domain` passed.
- The public RPC returned chain ID `0xaa044c`; public bytecode was present for all five contracts in `deployments/dapp-config.json`.
- Automated tests cover lifecycle-state mapping, project ID validation, MiniPay provider-marker validation, Sepolia-pinned writes, and explicit post-approval user actions.
- WalletConnect desktop/mobile session lifecycle, Valora selection/return, and MiniPay in-app authorization are **not verified** without the real wallet applications.
- No real wallet transaction was submitted. Do not treat successful compilation or tests as evidence of live wallet operation.

## Real-wallet checklist

1. Connect a desktop WalletConnect wallet through the QR modal; approve, reject, wait for expiry, disconnect, reconnect, and change account/chain.
2. Select Valora from the WalletConnect chooser on desktop and mobile; approve or reject, return to CeloHT, and verify address and chain.
3. Open `https://app.celoht.com` inside MiniPay, authorize the account, test chain/account changes, disconnect, and reconnect.
4. Confirm all writes use chain ID `11142220` and are reported successful only after receipt confirmation.
