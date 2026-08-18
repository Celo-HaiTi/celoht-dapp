# Reforestation

## In the dApp

- `/reforestation` — pillar overview
- `/reforestation/projects` — registered projects with live tree counts
  where `ImpactRegistry` is deployed
- `/donations` — direct USDm donations to a specific project

## On-Chain Model

Two contracts work together:

- **`ImpactRegistry`**: a `VERIFIER_ROLE` holder logs a `PlantingRecord`
  (tree count + IPFS evidence URI) against a registered project. Totals
  are summed on-chain and are the source of truth for "trees planted."
- **`DonationManager`**: accepts USDm donations earmarked to a project;
  a `WITHDRAWER_ROLE` holder routes funds to the project's beneficiary.

These are deliberately separate contracts — verifying planting activity
and moving donated funds are different trust boundaries with different
role holders.

## Why Evidence Matters

`recordPlanting` requires a non-empty `evidenceURI` and reverts otherwise
— see the test suite in
[`../packages/contracts/test/ImpactRegistry.test.ts`](../packages/contracts/test/ImpactRegistry.test.ts).
This is a deliberate design choice: the contract won't accept a
"trust me" planting record.
