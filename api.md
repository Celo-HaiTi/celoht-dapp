# API

## On-Chain "API"

The primary API surface of this dApp is the set of public functions on
five deployed contracts. Each has a corresponding interface in
[`../packages/contracts/contracts/interfaces/`](../packages/contracts/contracts/interfaces/)
documenting every function, parameter, and event with NatSpec comments —
treat those interfaces as the authoritative API reference.

| Contract            | Interface                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| AgentRegistry       | [`IAgentRegistry.sol`](../packages/contracts/contracts/interfaces/IAgentRegistry.sol)             |
| CertificateRegistry | [`ICertificateRegistry.sol`](../packages/contracts/contracts/interfaces/ICertificateRegistry.sol) |
| DonationManager     | [`IDonationManager.sol`](../packages/contracts/contracts/interfaces/IDonationManager.sol)         |
| ImpactRegistry      | [`IImpactRegistry.sol`](../packages/contracts/contracts/interfaces/IImpactRegistry.sol)           |
| GovernanceVoting    | No separate interface — see the contract directly                                                 |

ABIs are generated from these contracts and synced into the frontend via
`npm run contracts:sync-abis` — see `apps/web/src/lib/contracts/abis/`.

## Off-Chain API (Supabase)

Designed schema for off-chain data (not required to run the UI locally —
see `apps/web/src/lib/data/README.md` for the sample-data fallback):

### `courses`

| Column             | Type      | Notes                                        |
| ------------------ | --------- | -------------------------------------------- |
| `id`               | text (PK) | Matches `Course.id` in the sample data shape |
| `title`            | text      |                                              |
| `summary`          | text      |                                              |
| `modules`          | text[]    |                                              |
| `duration_minutes` | integer   |                                              |
| `language`         | text      |                                              |
| `level`            | text      |                                              |

### `agent_profiles`

| Column           | Type      | Notes                                                 |
| ---------------- | --------- | ----------------------------------------------------- |
| `wallet_address` | text (PK) | Matches the on-chain `AgentRegistry` entry            |
| `display_name`   | text      |                                                       |
| `region`         | text      |                                                       |
| `lat` / `lng`    | numeric   |                                                       |
| `metadata_uri`   | text      | The IPFS URI registered on-chain, for cross-reference |

### `partners`

| Column        | Type | Notes |
| ------------- | ---- | ----- |
| `name`        | text |       |
| `category`    | text |       |
| `description` | text |       |
| `url`         | text |       |

## IPFS

Evidence photos (reforestation), agent profile metadata, and certificate
metadata are designed to be pinned via a provider such as Pinata or
web3.storage — see `.env.example` in `apps/web/` for the expected
environment variables. No pinning integration is wired into the UI yet;
see [`../ROADMAP.md`](../ROADMAP.md).
