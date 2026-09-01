# Smart Contracts

The repository contains five Solidity contracts and their tests:

- `AgentRegistry`
- `CertificateRegistry`
- `DonationManager`
- `ImpactRegistry`
- `GovernanceVoting`

The local Hardhat suite currently passes 35 tests. The contracts are not deployed or verified on Celo Mainnet or Celo Sepolia in this repository, and they have not received a professional security audit. They must not be presented as production-secured or live.

## Before deployment

- Review access-control and treasury roles with the operating organization.
- Use a multisig for critical administrative and withdrawal roles.
- Deploy to Celo Sepolia first and verify every address and event.
- Verify source code on the appropriate Celo explorer.
- Record reviewed addresses in `addresses.ts`.
- Run contract tests and security analysis against the exact deployed bytecode.
