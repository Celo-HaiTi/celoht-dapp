# Changelog

All notable changes to the CeloHT dApp are documented here, following
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial monorepo structure (`apps/web`, `packages/contracts`).

## [0.1.0] - 2026-07-24

### Added

- **Contracts**: `AgentRegistry`, `CertificateRegistry` (soulbound ERC-721),
  `DonationManager` (fee capped at 5%), `ImpactRegistry`, and
  `GovernanceVoting` (role-based, no token) — 30 passing tests, compiled
  against Solidity 0.8.27 with the Cancun EVM target.
- **Frontend**: 18 pages across all three pillars plus dashboard, profile,
  settings, and help — Home, Dashboard, Education, Courses, Certificates,
  Agents, Agent Map, Transactions, Reforestation, Projects, Community,
  Governance, Donations, Impact, Partners, Profile, Settings, Help, and a
  custom 404.
- Wallet connection via wagmi + viem, with WalletConnect wired for Valora
  and mobile wallet support once a Project ID is configured.
- Hand-authored shadcn/ui-style component library (Button, Card, Badge,
  Tabs, Dialog, Toast, Progress, Skeleton) on Radix primitives.
- Security headers and a Content Security Policy in `next.config.ts`.
- ABI sync script keeping the frontend's contract ABIs generated directly
  from compiled artifacts, never hand-copied.
- CI/CD: build/lint/typecheck workflow, contract compile/test workflow,
  CodeQL, Dependabot, and issue/PR templates.

[Unreleased]: https://github.com/celo-ht/dapp/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/celo-ht/dapp/releases/tag/v0.1.0
