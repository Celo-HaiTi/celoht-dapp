export type Proposal = {
  id: number;
  title: string;
  summary: string;
  proposer: string;
  status: "Active" | "Closed";
  votesFor: number;
  votesAgainst: number;
  endsAt: string;
};

// Sample data — see README.md in this folder. In production this reads
// GovernanceVoting.getProposal(id) for each id up to proposalCount().
export const proposals: Proposal[] = [
  {
    id: 0,
    title: "Adopt a formal agent code of conduct",
    summary:
      "Ratify the code of conduct described in docs/agent-network.md as a binding requirement for new agent approvals.",
    proposer: "Maintainer Council",
    status: "Active",
    votesFor: 0,
    votesAgainst: 0,
    endsAt: "2026-08-15T00:00:00Z",
  },
];
