<div align="center">
  <img width="998" height="1000" alt="celoht-logo" src="https://github.com/user-attachments/assets/7c1df832-0218-40b8-97ca-5203e78f5970" />

# CeloHT dApp

**The official decentralized application for CeloHT** education, a
community agent network, and reforestation, built on the Celo ecosystem.

[![CI](https://github.com/celo-ht/dapp/actions/workflows/ci.yml/badge.svg)](.github/workflows/ci.yml)
[![Contracts](https://github.com/celo-ht/dapp/actions/workflows/contracts.yml/badge.svg)](.github/workflows/contracts.yml)
[![CodeQL](https://github.com/celo-ht/dapp/actions/workflows/codeql.yml/badge.svg)](.github/workflows/codeql.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-0B1120.svg)](LICENSE)

[Flagship repository](https://github.com/celo-ht/celoht) · [Website](https://github.com/celo-ht/website) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

---

## 🚀 **Demo**

### **[👉 Deploy Live for Investors (2 min) →](DEPLOY.md)**

### **Direct Access (For Investors)**

| Option | Link | Time |
|--------|------|------|
| **🔴 Live Demo** | [Launch dApp on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCelo-HaiTi%2Fceloht-dapp&project-name=celoht-dapp&repository-name=celoht-dapp&env=NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID&envDescription=Get%20a%20free%20WalletConnect%20project%20ID%20at%20https%3A%2F%2Fcloud.walletconnect.com) | 1-2 min |
| **💻 Run Locally** | `npm install && npm run dev` | 1 min |
| **📖 Full Guide** | [See DEPLOY.md](DEPLOY.md) | — |

**Want to explore CeloHT before diving into the code?**

Explore these features:
- ✅ **Wallet** — Send/receive demo assets with validation
- ✅ **Exchange** — Swap CELO ↔ cUSD with realistic rates
- ✅ **Education** — Browse courses and certificates
- ✅ **Agents** — Discover community agents on a map
- ✅ **Governance** — Vote on sample proposals
- ✅ **Impact** — Track reforestation metrics

> **Transparency:** All flows are clearly labeled **"Demo mode"** using realistic sample data with no false blockchain claims.

**See [DEPLOY.md](DEPLOY.md) for full deployment options and troubleshooting.**

---

This is a decentralized application that lets people learn financial and
Web3 basics, connect with verified community agents, and support
reforestation projects all through a wallet compatible with Valora, on
the Celo ecosystem.

**This is not an exchange, not a DeFi protocol, and not a token project.
No token is created or issued anywhere in this codebase.** Every smart
contract, page, and workflow exists to support CeloHT's three permanent
pillars see [`docs/mission.md`](docs/mission.md).

## The three pillars

| Pillar            | What the dApp does                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Education**     | Courses, quizzes, progress tracking, and soulbound (non-transferable) on-chain certificates on completion |
| **Agent Network** | A directory and map of verified community agents, backed by an on-chain registry                          |
| **Reforestation** | Verified planting records and direct cUSD donations to registered projects                                |

## Repository structure

```text
celoht-dapp/
├── apps/
│   └── web/              # Next.js frontend (App Router, TypeScript, Tailwind)
├── packages/
│   └── contracts/        # Solidity contracts, tests, and deployment scripts (Hardhat)
├── scripts/              # Repo-wide tooling (e.g. ABI sync)
├── docs/                 # Full documentation set
└── .github/               # CI/CD workflows, issue/PR templates
```

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown.

## Technology

- **Frontend**: Next.js, TypeScript, Tailwind CSS, hand-authored shadcn/ui-style
  components (built on Radix primitives see [`docs/architecture.md`](docs/architecture.md)
  for why these aren't installed via the shadcn CLI in this environment)
- **Web3**: wagmi, viem, WalletConnect (for Valora and other mobile wallets)
- **Contracts**: Solidity 0.8.27, Hardhat, OpenZeppelin Contracts 5.x
- **Off-chain data**: Supabase (optional the UI runs on documented sample
  data without it; see `apps/web/src/lib/data/README.md`)
- **CI/CD**: GitHub Actions (build, lint, typecheck, contract tests, CodeQL,
  Dependabot)

## Getting started

```bash
git clone https://github.com/celo-ht/dapp.git
cd dapp
npm install

# Frontend
npm run dev            # http://localhost:3000

# Contracts
npm run contracts:compile
npm run contracts:test
```

See [`docs/development.md`](docs/development.md) for the full guide,
including required environment variables, and
[`docs/deployment.md`](docs/deployment.md) for how contracts and the
frontend ship to production.

## Current status

The contract suite (5 contracts, 30 passing tests) is complete and
audited internally, but **not yet deployed to Celo mainnet or Alfajores**
see [`docs/deployment.md`](docs/deployment.md) for exact status and
[`ROADMAP.md`](ROADMAP.md) for the plan. Pages that read on-chain data
detect this and fall back to clearly labeled sample data rather than
showing broken or fabricated numbers.

## Documentation

The full index lives in [`docs/README.md`](docs/README.md), including
architecture, security, API, deployment, and contribution guides.

## Security

Found a vulnerability? Don't open a public issue see
[`SECURITY.md`](SECURITY.md).

## License

Code in this repository is available under the
[Apache 2.0 License](LICENSE).
