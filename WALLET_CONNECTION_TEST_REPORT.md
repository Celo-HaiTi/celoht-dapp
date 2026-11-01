# Wallet Connection Test Report

## Current implementation

- The app uses one Wagmi/Viem provider and configures only Celo Sepolia (chain ID `11142220`). All wallet-dependent pages read the active connection chain, not Wagmi's configured default.
- WalletConnect v2 uses Wagmi's connector and QR/deep-link chooser. Valora is offered through that chooser and is not affiliated with CeloHT.
- MiniPay detection requires `isMiniPay === true` and an EIP-1193 `request` method, including providers listed in `window.ethereum.providers`; it uses the same Wagmi injected-connector architecture.
- The wallet UI presents awaiting approval, submitted, pending, confirmed, failed, and rejected transaction states. Confirmation requires a successful receipt status.
- The local shell had no Reown/WalletConnect Project ID. No real wallet app or Reown dashboard was available for live verification.

## Project ID and deployment

Set either public build-time variable. `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is canonical; `NEXT_PUBLIC_REOWN_PROJECT_ID` is used only when the canonical variable is blank. If both are non-empty, they must match or WalletConnect is disabled.

```text
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<Reown project ID>
NEXT_PUBLIC_REOWN_PROJECT_ID=<same Reown project ID>
```

Create a project at https://cloud.reown.com/ and copy its 32-character Project ID. Invalid or conflicting values disable WalletConnect and Valora. Configure a public variable in GitHub Actions repository **Settings → Secrets and variables → Actions → Variables**, Vercel **Project Settings → Environment Variables**, or the Render service **Environment** settings. For static builds, it must be present at build time. Do not hardcode the ID.

Add these allowed application origins in Reown Cloud:

```text
https://app.celoht.com
http://localhost:3000
```

The dashboard allowlist could not be inspected, so those origin permissions remain unverified. The Project ID is public configuration; never put private credentials in these variables.

The default Sepolia RPC is `https://forno.celo-sepolia.celo-testnet.org`; `NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL` can override it. The explorer and deployed addresses are sourced from the checked-in deployment manifest.

## Verification classification

| Feature | Classification | Evidence / limitation |
| --- | --- | --- |
| Celo Sepolia-only chain configuration and active wrong-network handling | VERIFIED WORKING | Unit and Wagmi injected-provider tests verify chain `11142220`, a `chainChanged` to chain 1, and wrong-network state. |
| Project ID aliases, missing/invalid/conflicting values, and conditional connector setup | VERIFIED WORKING | Tests cover both names, fallback, matching and mismatched values, and the conditional WalletConnect connector configuration. |
| EIP-1193 account changes, chain changes, disconnect, and reconnect | VERIFIED WORKING | Tested against Wagmi's injected connector with a mocked EIP-1193 provider; no installed wallet was exercised. |
| MiniPay provider-marker detection | VERIFIED WORKING | Direct and `ethereum.providers` selection are tested with mock providers. |
| MiniPay authorization, account return, and in-app lifecycle | IMPLEMENTED BUT NOT VERIFIED | Requires a real MiniPay app/device session. |
| WalletConnect QR pairing and mobile chooser; Valora selection and return-to-app | IMPLEMENTED BUT NOT VERIFIED | No Project ID is configured in this environment; real QR/deep-link pairing was not performed. |
| Transaction state mapping and successful-receipt requirement | VERIFIED WORKING | Unit tests cover awaiting approval, submitted, pending, confirmed receipt, failed, and rejected states. |
| Real signed transaction and on-chain receipt lifecycle | IMPLEMENTED BUT NOT VERIFIED | No real wallet transaction was submitted. |
| Reown production origin allowlist | BLOCKED | Reown dashboard access was unavailable. |
| Mainnet and x402 support | NOT IMPLEMENTED | Deliberately excluded; the app supports Celo Sepolia only. |

Automated gates passed: `npm run lint`, `npm run typecheck`, `npm test` (32/32), and `npm run build`. The wallet-focused test command also passed 10/10. The full suite emits Node's existing module-typeless warning for TypeScript test imports; it does not fail tests. Successful mocks/builds do not establish live wallet compatibility.

## Real-wallet checklist

1. Configure a Reown Project ID and allowed origins, then connect a desktop WalletConnect wallet through QR; approve, reject, wait for expiry, disconnect, reconnect, and change account/chain.
2. Select Valora from the WalletConnect chooser on desktop and mobile; approve/reject, return to CeloHT, and verify the address and active chain.
3. Open `https://app.celoht.com` inside MiniPay; authorize, verify account/chain changes, disconnect, reconnect, and test the return-to-app flow.
4. With a disposable funded Sepolia wallet, submit a user-approved transaction; verify the transaction hash, pending receipt, confirmation, rejection, and reverted/failure handling. Confirm no unsupported-chain transaction is submitted.
