# Roadmap

This roadmap covers the dApp specifically. For the ecosystem-wide roadmap
(education programs, agent network expansion, reforestation phases), see
the flagship repository's
[`ROADMAP.md`](https://github.com/celo-ht/celoht/blob/main/ROADMAP.md).

## Phase 1 — Foundation (current)

- [x] Contract suite: AgentRegistry, CertificateRegistry, DonationManager,
      ImpactRegistry, GovernanceVoting — 30 passing tests
- [x] Frontend scaffold: all core pages, wallet connection, theme support
- [x] CI/CD: build, lint, typecheck, contract tests, CodeQL, Dependabot
- [ ] External audit of the contract suite
- [ ] Deploy contracts to Alfajores (testnet)

## Phase 2 — Testnet Validation

- [ ] Full end-to-end testing on Alfajores with real community agents
- [ ] Supabase integration for off-chain profile and course content
- [ ] IPFS pinning integration for evidence photos and metadata
- [ ] WalletConnect Project ID provisioned and QR-code flow tested with Valora

## Phase 3 — Mainnet Launch

- [ ] External audit findings resolved
- [ ] Contracts deployed to Celo mainnet with the real USDm address
- [ ] Transaction history indexer (replacing the current Celoscan link-out)
- [ ] Public launch of the dApp alongside the CeloHT website

## Phase 4 — Growth

- [ ] Real map provider integration (replacing the built-in lightweight
      visualization on the Agent Map page)
- [ ] Push/email notification delivery for the preferences already
      collected on the Settings page
- [ ] Expanded governance participation as described in the flagship
      repository's governance roadmap

See [`docs/deployment.md`](docs/deployment.md) for exact current
deployment status at any given time.
