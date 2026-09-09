# Mainnet Activation Checklist

This wallet is intentionally configured for safe testnet-first operation. A production Mainnet activation is a controlled configuration change only.

## Required configuration

- [ ] Mainnet network configured in the environment and wallet config
- [ ] RPC URL verified for Celo Mainnet
- [ ] USDm contract address verified and recorded in the environment
- [ ] CELO gas configuration verified for the production network
- [ ] WalletConnect project ID configured for production wallet access
- [ ] Valora tested on Celo Mainnet
- [ ] MiniPay tested on Celo Mainnet
- [ ] WalletConnect-compatible wallet tested on Celo Mainnet
- [ ] Transaction send path tested end-to-end
- [ ] Receive flow tested end-to-end
- [ ] Explorer links verified for Mainnet
- [ ] Contract addresses verified against the official deployment manifest
- [ ] Production API endpoint configured when required
- [ ] Security review completed
- [ ] Mobile testing completed
- [ ] Accessibility testing completed
- [ ] Production build passes

## Safe activation rules

1. Update the environment values only; do not redesign the wallet UI.
2. Keep `USDm` naming consistent across the app and configuration records.
3. Confirm every network-specific value matches the official CeloHT deployment metadata.
4. If a Mainnet value is missing, keep the app in a safe, clearly labeled unavailable state.
5. Do not rely on any fake or assumed Celo Mainnet contract address or RPC.

## Minimum environment values

- `NEXT_PUBLIC_CELO_NETWORK`
- `NEXT_PUBLIC_CELO_CHAIN_ID`
- `NEXT_PUBLIC_CELO_RPC_URL`
- `NEXT_PUBLIC_CELO_EXPLORER_URL`
- `NEXT_PUBLIC_USDM_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_CELOHT_AGENT_REGISTRY_ADDRESS`
- `NEXT_PUBLIC_CELOHT_SERVICE_PAYMENTS_ADDRESS`
- `NEXT_PUBLIC_CELOHT_EDUCATION_ADDRESS`
- `NEXT_PUBLIC_CELOHT_REFORESTATION_ADDRESS`
- `NEXT_PUBLIC_CELOHT_GOVERNANCE_ADDRESS`
- `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_BACKEND_URL` when backend integrations are enabled

Once these values are verified and live, the same wallet experience continues to work without any UI redesign.
