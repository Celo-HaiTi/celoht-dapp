# Agent Network

## In the dApp

- `/agents` — directory of registered agents
- `/agents/map` — a lightweight, built-in geographic visualization of
  active agents

## On-Chain Model

Agents self-register via `AgentRegistry.registerAgent(metadataURI)`,
entering a `Pending` state. A `COORDINATOR_ROLE` holder then calls
`approveAgent` to activate them. Coordinators can `suspendAgent` and
`reinstateAgent` as needed. See
[`../packages/contracts/contracts/AgentRegistry.sol`](../packages/contracts/contracts/AgentRegistry.sol)
for the full contract and its test suite for the exact state machine.

## Off-Chain Profile Data

`metadataURI` points to off-chain profile data (display name, region,
coordinates, services offered) — designed to be pinned to IPFS. The
directory and map pages currently render sample profiles
(`apps/web/src/lib/data/agents.ts`) with the same shape that resolved
metadata would have.

## Becoming an Agent

See the flagship repository's
[`docs/agent-network.md`](https://github.com/celo-ht/celoht/blob/main/docs/agent-network.md)
for the full, non-technical process (education requirement, operating
standards, code of conduct) behind the on-chain registration step.
