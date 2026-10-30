# Wallet Connection Test Report

## Implementation status

- Wagmi is restricted to Celo Sepolia chain ID 11142220.
- WalletConnect and Valora use the official Wagmi/Reown WalletConnect connector.
- MiniPay uses `ethereum.isMiniPay`, `eth_requestAccounts`, `eth_chainId`, and `wallet_switchEthereumChain` / `wallet_addEthereumChain`.
- Account, chain, disconnect, and reconnect state are provided by one Wagmi configuration shared by the DApp.
- The wallet modal displays WalletConnect, Valora App, and MiniPay separately.
- MiniPay unavailable state is explicit: "Open this DApp inside MiniPay to connect your wallet."

## Provider configuration

Set this public deployment variable before enabling WalletConnect or Valora:

```text
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<approved Reown project ID>
```

Create the project at https://cloud.reown.com/. Do not commit a private key or service credential. The project ID is public configuration, but it must be approved for the CeloHT deployment domain.

Configure the Sepolia RPC with:

```text
NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
NEXT_PUBLIC_CELO_NETWORK=celoSepolia
NEXT_PUBLIC_CELO_CHAIN_ID=11142220
NEXT_PUBLIC_APP_URL=https://app.celoht.com/
```

## Verified infrastructure evidence

- RPC `eth_chainId` returned `0xaa044c`, which is 11142220 decimal.
- RPC returned bytecode for the Agent Registry, Service Payments, Education, Reforestation, and Governance contracts.
- Production audit returned zero vulnerabilities.
- Lint, TypeScript, 19 tests, static export, and server build passed.

## Provider acceptance

### WalletConnect: CONFIGURED / REAL-SESSION TEST REQUIRED

The public Reown/WalletConnect project ID is configured in the Pages deployment and the official Wagmi connector is enabled. Provider acceptance remains pending real desktop/mobile QR session evidence; build success alone is not sufficient for READY.

### Valora: CONFIGURED / REAL-SESSION TEST REQUIRED

Valora uses the configured WalletConnect connector. Mobile app connection, account detection, Sepolia validation, cancellation, and return behavior require real-device testing.

### MiniPay: NOT READY

The provider implementation is present and rejects false claims, but real MiniPay permissions, accounts, chain switching, disconnection, and account changes require testing inside the MiniPay application/browser environment.

## Real manual test checklist

### WalletConnect

1. Configure the approved project ID.
2. Open app.celoht.com on desktop.
3. Scan WalletConnect QR with a compatible wallet.
4. Approve account permissions.
5. Confirm the address and chain ID 11142220 in the modal.
6. Reject the session and verify the error/retry state.
7. Disconnect and reconnect.
8. Change accounts and chains and verify the shared UI updates.

### Valora

1. Open WalletConnect in the Valora mobile environment.
2. Approve the Valora session.
3. Return to app.celoht.com.
4. Verify the wallet address and Sepolia chain ID.
5. Reject/cancel and verify the error state.

### MiniPay

1. Open app.celoht.com inside MiniPay.
2. Choose MiniPay in the connection modal.
3. Approve `eth_requestAccounts`.
4. Verify `eth_chainId` and the returned address.
5. If the provider is on another network, approve Sepolia switching or chain addition.
6. Verify account and chain-change events.
7. Disconnect and reconnect.

## Remaining configuration blockers

- Approved and configured Reown project ID.
- GitHub Actions repository variable or equivalent production environment variable.
- Real-wallet device evidence for WalletConnect, Valora, and MiniPay.
- No database/API server is currently attached to GitHub Pages for signed pilot workflows.
