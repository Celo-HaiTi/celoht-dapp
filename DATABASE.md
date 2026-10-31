# Database Boundary

The static GitHub Pages application does not connect directly to the database. It calls the official CeloHT backend, which owns server-side database access.

## Required production service

Use the canonical PostgreSQL schema in `Celo-HaiTi/celoht-supabase`. The browser must never connect with a service-role credential. The official backend owns application queries and authorization; the indexer owns blockchain event writes. Secrets remain in their respective server runtime secret stores.

## Minimum tables

`users`, `wallets`, `transactions`, `blockchain_events`, `agents`, `agent_applications`, `donations`, `reforestation_projects`, `trees`, `courses`, `lessons`, `course_progress`, `quiz_attempts`, `notifications`, and `audit_logs`.

## Source of truth

Blockchain state is authoritative for money and contract events. PostgreSQL stores indexed state, application metadata, and off-chain content. A database row must never mark a transaction confirmed before the corresponding chain receipt/event is validated.

## Activation checklist

- Create migrations, foreign keys, unique event identifiers, timestamps, and indexes in `celoht-supabase` only.
- Enable Row Level Security and test policies with non-admin accounts.
- Add a server-side API with input validation and rate limits.
- Keep migrations and seed fixtures separate from production data.
