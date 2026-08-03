# Security Policy

## Reporting a Vulnerability

Please **don't** open a public issue for a security vulnerability —
especially a smart contract vulnerability. Instead:

- **Email**: security@celoht.com
- **GitHub Security Advisories**: use ["Report a vulnerability"](https://github.com/celo-ht/dapp/security/advisories/new)

Include a description, reproduction steps or a proof-of-concept, and the
affected contract address / commit / frontend version.

## Scope

| In scope                                | Out of scope                         |
| --------------------------------------- | ------------------------------------ |
| `packages/contracts/contracts/**`       | The Celo protocol itself             |
| `apps/web/src/**`                       | Valora's application security        |
| CI/CD workflows in `.github/workflows/` | Third-party wallet extensions        |
| Wallet-connection and signing flows     | WalletConnect's relay infrastructure |

## Smart Contract Security Practices

- All contracts use OpenZeppelin's audited `AccessControl`, `Pausable`,
  and `ReentrancyGuard` base contracts rather than reimplementing them.
- `DonationManager`'s platform fee is hard-capped at 5% in code — no
  admin key can raise it further.
- Every contract has `pause()`/`unpause()` gated to `ADMIN_ROLE`, so a
  detected issue can halt state-changing functions without a redeploy.
- CertificateRegistry certificates are soulbound (non-transferable) by
  construction, removing an entire class of transfer-related exploits.
- `npm run contracts:test` (30 tests as of this writing) runs on every
  Pull Request via CI — see `.github/workflows/contracts.yml`.

Before any mainnet deployment, contracts should go through an external
audit — see [`docs/deployment.md`](docs/deployment.md) for current status.

## Frontend Security Practices

- A strict Content Security Policy and standard security headers are set
  in `apps/web/next.config.ts`.
- The frontend never requests or stores a private key or seed phrase —
  all signing happens in the user's own wallet.
- Dependency vulnerabilities are tracked via Dependabot and `npm audit`
  in CI.

## Response Timeline

| Step                | Target                                                 |
| ------------------- | ------------------------------------------------------ |
| Acknowledge receipt | 48 hours                                               |
| Initial assessment  | 5 business days                                        |
| Remediation plan    | 10 business days (sooner for critical contract issues) |

## Acknowledgment

We're glad to credit researchers who disclose responsibly — with your
permission — in [`CHANGELOG.md`](CHANGELOG.md).
