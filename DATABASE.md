# Database Boundary

There is currently no database connection in the static GitHub Pages application.

## Required production service

Use PostgreSQL, preferably through Supabase if that remains the chosen platform. The browser must use only the public anonymous key. Service-role keys and database credentials belong in a server-side API or worker, never in `NEXT_PUBLIC_*` variables.

## Minimum tables

`users`, `wallets`, `transactions`, `blockchain_events`, `agents`, `agent_applications`, `donations`, `reforestation_projects`, `trees`, `courses`, `lessons`, `course_progress`, `quiz_attempts`, `notifications`, and `audit_logs`.

## Source of truth

Blockchain state is authoritative for money and contract events. PostgreSQL stores indexed state, application metadata, and off-chain content. A database row must never mark a transaction confirmed before the corresponding chain receipt/event is validated.

## Activation checklist

- Create migrations, foreign keys, unique event identifiers, timestamps, and indexes.
- Enable Row Level Security and test policies with non-admin accounts.
- Add a server-side API with input validation and rate limits.
- Keep migrations and seed fixtures separate from production data.
