# Supported Wallets

## Primary: Valora

CeloHT's education material and this dApp are built around
[Valora](https://valoraapp.com), a mobile wallet designed for simplicity
on the Celo network. **CeloHT does not own, operate, or control Valora**
— we build tools compatible with it.

Valora connects to this dApp through **WalletConnect**: on desktop, scan
a QR code from the Valora app; on mobile, Valora can open the dApp
directly through a deep link if visited from within the Valora app's
browser.

## Also Supported

| Wallet                                                                   | Connection method       |
| ------------------------------------------------------------------------ | ----------------------- |
| Any browser extension wallet (MetaMask, Rabby, etc.) configured for Celo | Injected connector      |
| Any WalletConnect-compatible mobile wallet                               | WalletConnect (QR code) |

## Requirements

- **WalletConnect** requires a Project ID to be configured
  (`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`) — without it, only injected
  browser wallets are offered. See [`docs/development.md`](docs/development.md).
- Your wallet must be configured for **Celo mainnet** or **Alfajores**
  (Celo's public testnet) — this dApp doesn't support other networks.

## Adding CELO/Alfajores to a Wallet

Most wallets support adding Celo automatically through
[chainlist.org](https://chainlist.org) or Celo's own documentation. Valora
has Celo configured by default since it's built specifically for this
network.

## What This App Never Asks For

CeloHT will never ask for your seed phrase, private key, or wallet
password, in this app or anywhere else. Every signature request happens
inside your own wallet's interface — the dApp only ever requests a
signature or transaction approval, never your credentials directly.
