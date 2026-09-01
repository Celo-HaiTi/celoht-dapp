# Impact

The `/impact` page aggregates metrics across all three pillars:

| Metric             | Source (once deployed)                                            | Source (today) |
| ------------------ | ----------------------------------------------------------------- | -------------- |
| Trees planted      | `ImpactRegistry.totalTreesFor(projectId)`, summed across projects | Sample data    |
| Donations received | `DonationManager.totalDonatedTo(projectId)`, summed               | Sample data    |
| Active agents      | `AgentRegistry.agentsPage()`, filtered by status                  | Sample data    |
| Courses available  | Supabase `courses` table (or sample data)                         | Sample data    |

CeloHT's broader impact reporting commitments (annual reports, monthly
updates) are documented in the flagship repository's
[`docs/faq.md`](https://github.com/Celo-HaiTi/celoht/blob/main/docs/faq.md)
and roadmap. This page is the real-time, on-chain-verifiable complement
to those periodic reports.
