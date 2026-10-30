# CeloHT Controlled Testnet Pilot

## Scope

This pilot uses Celo Sepolia, chain ID 11142220. It provides database-backed education, agent operations, and reforestation workflows plus existing Celo Sepolia contract reads/writes. It does not deploy to mainnet.

## Database setup

Apply migrations in order:

1. `supabase/migrations/20260909000000_notifications.sql`
2. `supabase/migrations/20261030000000_pilot_pillars.sql`

Use Supabase's SQL editor or migration tooling. Keep service-role credentials out of browser code and logs.

## Required environment

- `NEXT_PUBLIC_SUPABASE_URL`: public project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public browser key. It is not an administrative secret.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key used by `/api/pilot/*` routes.
- `PILOT_SESSION_SECRET`: random server-only secret at least 32 bytes of entropy.

## Wallet setup

Configure WalletConnect only after a project ID is approved. The existing app supports direct injected wallets regardless. The pilot authentication route signs:

`CeloHT pilot login nonce: <nonce>`

Sessions expire after 24 hours.

## Education operations

Publish courses through an authorized database/admin process. Course lessons must be complete for the authenticated wallet before certificate issuance. Quiz attempts must contain an actual passing score. Certificate identifiers are unique and database-backed; they are not accreditation.

## Agent operations

On-chain agent registration creates an unverified registry record. Database identity verification is a separate role-controlled workflow. Admin review statuses are:

- pending
- under review
- approved
- rejected
- additional information required
- suspended

Cash-in and cash-out in `/pilot` are labeled simulations and never claim physical cash movement or blockchain settlement.

## Reforestation operations

A submitted planting record is excluded from public verified impact. Public reads show only `verified` events. Authorized reviewers can mark evidence under review, verified, rejected, or needing additional evidence. Verified trees must not exceed planted trees. Survival records support 6 and 18 months.

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

- Apply migrations and verify RLS/storage policies.
- Add course and lesson records with authorized content.
- Configure Supabase Storage buckets with least-privilege policies if document/photo uploads are enabled.
- Assign `admin` or `authorized_reviewer` JWT/role records to approved operators.
- Configure a WalletConnect project only if approved.
- Configure production secret storage and rotate secrets after deployment.
- Verify every contract address against synchronized Sepolia deployment metadata and block explorer before enabling financial actions.

## Pilot readiness

Do not mark the pilot ready until migrations, end-to-end browser authentication, server authorization tests, database persistence tests, wallet network checks, contract checks, mobile checks, and production build evidence are complete.
