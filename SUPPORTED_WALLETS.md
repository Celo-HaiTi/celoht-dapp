Supported Wallets

Wallet Support

CeloHT follows a wallet-agnostic strategy. The dApp supports MiniPay when opened inside MiniPay, as well as Valora and other compatible mobile wallets through WalletConnect, subject to current integration availability.

Supported Connection Methods

Wallet / Connection| Connection Method
MiniPay| Injected provider when the dApp is opened inside MiniPay
Valora| WalletConnect
Other WalletConnect-compatible mobile wallets| WalletConnect (QR code)

Network Support

The dApp supports the following Celo networks:

- Celo Mainnet
- Celo Sepolia

The dApp does not support other networks.

WalletConnect Requirements

WalletConnect requires a Project ID to be configured:

"NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"

See ""docs/development.md"" (docs/development.md) for configuration instructions.

Adding Celo or Celo Sepolia to a Wallet

Most compatible wallets can add Celo networks through their built-in network configuration or through "Chainlist" (https://chainlist.org) and Celo's official documentation.

Wallet availability and network configuration may vary by wallet provider.

What This App Never Asks For

CeloHT will never ask for your seed phrase, private key, or wallet password, either in this app or anywhere else.

All wallet signatures and transaction approvals happen inside the user's own wallet interface. The dApp only requests the appropriate signature or transaction approval and never requests or handles wallet credentials directly.