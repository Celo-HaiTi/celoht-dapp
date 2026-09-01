# Governance

This repository follows the same governance model as the rest of the
CeloHT ecosystem — see the flagship repository's
[`GOVERNANCE.md`](https://github.com/Celo-HaiTi/celoht/blob/main/GOVERNANCE.md)
for the full, binding policy. This document covers what's specific to the
dApp repository.

## Roles Specific to This Repository

| Role                 | Responsibility                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Frontend Maintainer  | Reviews changes to `apps/web`                                                                                      |
| Contracts Maintainer | Reviews changes to `packages/contracts`; required reviewer on any contract change (see [`CODEOWNERS`](CODEOWNERS)) |
| Release Manager      | Tags releases and coordinates contract deployments                                                                 |

## Smart Contract Changes Get Extra Scrutiny

Because contract changes are harder to reverse once deployed, any Pull
Request touching `packages/contracts/contracts/**` requires:

1. A passing test suite, including new tests for the change itself
2. Review from a Contracts Maintainer (enforced via
   [`CODEOWNERS`](CODEOWNERS))
3. For changes affecting a contract already deployed to Alfajores or
   mainnet, an explicit note in the PR description about migration or
   redeployment impact

## No Token Governance

CeloHT has no token, so this repository's `GovernanceVoting` contract
uses role-based, one-address-one-vote voting rather than token-weighted
voting — see [`docs/governance.md`](docs/governance.md) for the reasoning
and [`GovernanceVoting.sol`](packages/contracts/contracts/GovernanceVoting.sol)'s
NatSpec for the implementation detail.

## Changes to This Document

Follow the same process as the flagship repository: a 14-day public
comment period and majority Maintainer Council approval for governance
changes.
