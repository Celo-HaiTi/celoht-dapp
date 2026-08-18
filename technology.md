# Technology

## Why Celo

Celo's mobile-first design and low transaction fees match the CeloHT
mission — see the flagship repository's
[`docs/technology.md`](https://github.com/celo-ht/celoht/blob/main/docs/technology.md)
for the ecosystem-wide reasoning. This document covers dApp-specific
technical choices.

## Why Solidity 0.8.27 / Cancun

Solidity 0.8.27 was chosen for its built-in overflow checks and current
tooling support. The EVM target is set to `cancun` in
[`hardhat.config.ts`](../packages/contracts/hardhat.config.ts) because
OpenZeppelin Contracts 5.x uses `MCOPY`, an opcode introduced in Cancun.
**Before any mainnet deployment, confirm Celo's current mainnet supports
the Cancun opcode set** — Celo has been aligning closely with Ethereum
L1 hardforks, but this should be verified at deploy time, not assumed;
see [`deployment.md`](deployment.md).

## Why OpenZeppelin

Every contract builds on OpenZeppelin's audited `AccessControl`,
`Pausable`, `ReentrancyGuard`, and `ERC721` implementations rather than
custom code, to minimize the amount of security-critical logic CeloHT
maintains itself.

## Why wagmi + viem (not ethers.js directly)

wagmi provides React hooks (`useReadContract`, `useWriteContract`,
`useAccount`) with built-in caching via TanStack Query, and viem gives
strong TypeScript types generated from ABIs — reducing a whole class of
"wrong argument type" bugs at the wallet-interaction boundary.

## Why Hand-Authored UI Components Instead of the shadcn CLI

See [`../ARCHITECTURE.md`](../ARCHITECTURE.md#why-some-ui-components-are-hand-authored-not-shadcn-add-generated).

## No Token, Anywhere

No contract in `packages/contracts` inherits from `ERC20` or represents a
fungible, transferable balance of anything CeloHT controls. The only
`ERC20` reference in the codebase is `MockERC20.sol`, explicitly marked
test-only, standing in for USDm in the test suite.
