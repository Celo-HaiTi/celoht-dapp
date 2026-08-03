# Sample Data

The modules in this folder are **sample/seed data for local development
and UI review** — not a live backend. Each file is typed and documented so
it's a drop-in shape for the real data source it stands in for:

| File           | Stands in for                                                                    |
| -------------- | -------------------------------------------------------------------------------- |
| `courses.ts`   | Supabase `courses` table (see docs/API.md)                                       |
| `agents.ts`    | On-chain `AgentRegistry` reads, joined with off-chain profile metadata from IPFS |
| `projects.ts`  | On-chain `ImpactRegistry` / `DonationManager` project reads                      |
| `proposals.ts` | On-chain `GovernanceVoting` proposal reads                                       |
| `partners.ts`  | Supabase `partners` table                                                        |

Every page that imports from here is clearly wired to swap this for a real
query — see the `// TODO(data):` comment at each import site.
