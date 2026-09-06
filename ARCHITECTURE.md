# Architecture

```text
Official smart-contract repository
        |
        v
Official deployment manifests + ABI arrays
        |
        | npm run contracts:sync
        v
DApp deployment snapshot and generated ABIs
        |
        v
Central address/ABI layer -> wagmi/viem -> connected Celo wallet/RPC
        |
        v
Static Next.js frontend on GitHub Pages
```

## On-chain boundary

The single contract configuration layer is `addresses.ts`, `index.ts`, `deployments/dapp-config.json`, and `abis/`. The active Celo Sepolia contracts are `CeloHTAgentRegistry`, `CeloHTServicePayments`, `CeloHTEducation`, `CeloHTReforestation`, and `CeloHTGovernance`.

## Off-chain boundary

Course content, profile metadata, evidence, indexed events, persistent progress, and authentication are not blockchain state. Supabase support is optional and browser-only through the public anonymous key; no service-role credential or admin API exists in this static repository. Without an indexed backend, pages show `Unavailable` rather than inventing records.

## Privileged boundary

Contract roles and treasury authority remain on-chain. The frontend does not administer roles and does not contain private keys. A future admin workflow must use server nonce/signature authentication and server-side authorization before touching any privileged operation.
