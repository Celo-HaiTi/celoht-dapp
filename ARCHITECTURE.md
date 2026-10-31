# Architecture

```text
Official smart-contract repository
        |
        v
Official deployment manifests + ABI arrays
        |
        | npm run contracts:sync (external official checkout in CI)
        v
DApp deployment snapshot and generated ABIs
        |
        v
Central address/ABI layer -> wagmi/viem -> connected Celo wallet/RPC
        |
        v
Static Next.js frontend on GitHub Pages -> official celoht-backend API
                                           |
                                           v
                                canonical Supabase + indexer
```

## On-chain boundary

The single contract configuration layer is `addresses.ts`, `index.ts`, `deployments/dapp-config.json`, and `abis/`. The active Celo Sepolia contracts are `CeloHTAgentRegistry`, `CeloHTServicePayments`, `CeloHTEducation`, `CeloHTReforestation`, and `CeloHTGovernance`.

## Off-chain boundary

Course content, profile metadata, evidence, indexed events, persistent progress, and authentication are not blockchain state. The browser calls the official `celoht-backend` API; it does not connect directly to Supabase or hold database credentials. Canonical schema and migrations belong to `celoht-supabase`; service-role access belongs only to backend/indexer runtimes. Without a healthy configured backend, pages show an unavailable state rather than invented records.

## Privileged boundary

Contract roles and treasury authority remain on-chain. The frontend does not administer roles and does not contain private keys. A future admin workflow must use server nonce/signature authentication and server-side authorization before touching any privileged operation.

The backend-dependent capabilities are unavailable unless `NEXT_PUBLIC_BACKEND_URL` points to a healthy deployed `celoht-backend`. Authentication, KYC/application workflows, indexed education progress, reforestation evidence, governance feeds, and user-specific application data must come from that backend; the UI must not infer them from local storage or transaction submission.

When `NEXT_PUBLIC_BACKEND_URL` is configured, the header exposes the backend's nonce/signature wallet sign-in flow. Authenticated backend requests use the HttpOnly session cookie issued by `/api/v1/auth/verify`; no service-role secret is sent to the browser. Backend-dependent features remain unavailable when the URL is unset, CORS rejects the Pages origin, or the backend health check is failing.
