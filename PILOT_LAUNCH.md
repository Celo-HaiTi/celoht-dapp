# CeloHT Controlled Testnet Pilot

## Scope

This pilot uses Celo Sepolia, chain ID 11142220. It provides database-backed education, agent operations, and reforestation workflows plus existing Celo Sepolia contract reads/writes. It does not deploy to mainnet.

## Database setup

Use the canonical migrations in `Celo-HaiTi/celoht-supabase` and follow that repository's migration order. Do not apply the dApp-local pilot schema as a second source of truth. Keep service-role credentials in the official backend's secret manager only.

## Required environment

- `NEXT_PUBLIC_BACKEND_URL`: public API origin, preferably `https://api.celoht.com`.
- Backend-only settings belong in the official backend's Render environment as listed in its `render.yaml`: Supabase URL/keys, `CELO_CHAIN_ID=11142220`, Celo Sepolia RPC, `AUTH_SESSION_SECRET`, rate-limit settings, and `CELOHT_ALLOWED_ORIGIN=https://app.celoht.com`.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: optional public Reown project ID for WalletConnect and Valora.

## Wallet setup

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to an approved Reown project ID to enable WalletConnect and Valora. Without it, those connectors remain unavailable; injected wallets and MiniPay remain separate options. The official backend issues the nonce and session cookie; the wallet signs only the backend-provided challenge. Session lifetime is controlled by backend configuration.

## Hosting requirement

Keep the frontend on GitHub Pages. Deploy the existing `Celo-HaiTi/celoht-backend` repository with its `render.yaml`, attach `api.celoht.com`, and configure CORS to allow only `https://app.celoht.com`. Add the public `NEXT_PUBLIC_BACKEND_URL=https://api.celoht.com` repository variable so the GitHub Pages build can call the backend. Do not put backend secrets in GitHub variables or `NEXT_PUBLIC_*` values.

## Education operations

The official backend currently exposes a published course catalog and progress by lesson ID. It does not expose lesson details, enrollment, quiz submission, or certificate issuance. Do not represent these learner actions as operational until the API and persisted workflow are implemented.

## Agent operations

The official backend exposes agent application submission and KYC/admin review. On-chain agent registration remains a separate unverified registry record. Admin review statuses are:

- pending
- under review
- approved
- rejected
- additional information required
- suspended

The official backend currently exposes agent applications and KYC review, but no cash-in/cash-out service endpoint. Do not claim these operations are available. Application approval alone is not identity verification; secure document storage and a verification provider remain external requirements.

## Reforestation operations

The official backend currently exposes published projects and verified evidence reads. Contribution amounts remain on-chain; physical planting submissions, GPS/photo evidence, review actions, and 6/18-month survival workflows are not exposed by its current API.

## Reporting

All reports and exports must be generated from database rows and authorized server routes. No static sample planting, learner, agent, or transaction should be mixed into pilot records.

## External blockers register

| Item | Missing | Required owner/approval | Affected functionality | Safe test alternative |
|---|---|---|---|---|
| Independent smart-contract audit | External audit report | Audit provider and CeloHT | Any claim of mainnet or pilot financial safety | Database simulation and testnet contract read-only checks |
| Production credentials/infrastructure | Production Supabase, secret store, domain and hosting | CeloHT operations | Pilot persistence, sessions, uploads, production availability | Local/staging Supabase and signed test wallet session |
| Institutional education approval | Partner accreditation decision | Partner institution | Accredited certificates | Label certificates as course completion only |
| Identity verification/KYC provider | Production provider and legal policy | CeloHT and approved provider | Agent identity approval | Document submission status; no real-world identity claim |
| Secure evidence storage | Private bucket/storage policy | CeloHT operations | Agent and reforestation documents/photos | URLs and audit records until provider is configured |
| Partner agreements | Signed operating agreements | CeloHT partners | Agent cash operations | Simulated service records only |
| Mainnet authorization | Signed release decision and audit | CeloHT governance | Mainnet deployment | Celo Sepolia only |
| External notification provider | Provider credentials | CeloHT operations | Push delivery | Database notification records |

## Manual configuration still required

- Apply and verify canonical migrations and RLS policies from `celoht-supabase`.
- Add course and lesson records with authorized content.
- Configure Supabase Storage buckets with least-privilege policies if document/photo uploads are enabled.
- Assign `admin` or `authorized_reviewer` JWT/role records to approved operators.
- Configure a WalletConnect project only if approved.
- Configure Render secrets from the backend's `render.yaml`; do not store them in the frontend repository.
- Verify every contract address against synchronized Sepolia deployment metadata and block explorer before enabling financial actions.

## Pilot readiness

Do not mark the pilot ready until migrations, end-to-end browser authentication, server authorization tests, database persistence tests, wallet network checks, contract checks, mobile checks, and production build evidence are complete.
