# Donations

## How It Works

1. A project is registered in `DonationManager` (and separately in
   `ImpactRegistry`, for tracking planting activity against the same
   project ID).
2. A donor approves the donation token (USDm) for the `DonationManager`
   contract, then calls `donate(projectId, amount, memoURI)`.
3. The donated amount, minus an optional platform fee (0% by default,
   hard-capped at 5% in the contract), is credited to that project's
   available balance.
4. A `WITHDRAWER_ROLE` holder calls `withdraw(projectId, to, amount)` to
   route funds to the project's real-world beneficiary.

See
[`../packages/contracts/contracts/DonationManager.sol`](../packages/contracts/contracts/DonationManager.sol)
and its test suite for the exact behavior, including the fee cap
enforcement and reentrancy protection.

## In the dApp

The `/donations` page (see
[`../apps/web/src/app/donations/page.tsx`](../apps/web/src/app/donations/page.tsx))
provides a project picker and amount field, then calls `donate` directly
via `useWriteContract`. A production version should add an explicit
ERC-20 `approve` step before `donate` if the connected wallet hasn't
already approved a sufficient allowance — see the `TODO` noted in that
file's donation flow for the next implementation step.
