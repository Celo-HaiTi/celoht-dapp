# Frequently Asked Questions

**Does the CeloHT dApp have a token?**
No. There is no CeloHT token anywhere in this codebase, and none is
planned. The app uses CELO (for gas) and USDm (for donations), both
existing Celo ecosystem assets that CeloHT doesn't issue or control.

**Is this an exchange or a DeFi protocol?**
No. There's no swapping, lending, or liquidity functionality here. The
contracts in this repository are registries (agents, certificates,
reforestation records, governance votes) and a donation manager — nothing
that behaves like an exchange or a yield-generating protocol.

**Why does a page say a contract "isn't deployed on this network yet"?**
The contract suite is complete and tested but is deployed by network as a
separate step, with Celo Sepolia used for testnet validation before Celo
Mainnet — see [`docs/deployment.md`](docs/deployment.md) for current
status. Pages detect this and show sample data clearly labeled as such,
rather than failing or showing fabricated numbers.

**Do I need to trust CeloHT with my funds?**
No. This dApp only ever requests a signature or transaction approval from
your own wallet — it never takes custody of funds. Donations go directly
from your wallet to the `DonationManager` contract, which is open source
and auditable.

**Why is voting role-based instead of open to everyone?**
CeloHT has no governance token, so voting can't be token-weighted. Making
voting fully open (any address) would be trivially Sybil-able. The
current model trades permissionless participation for Sybil resistance —
see [`docs/governance.md`](docs/governance.md).

**How do I become a verified agent?**
Register on-chain via `AgentRegistry.registerAgent` after completing the
CeloHT education program, then wait for a network coordinator's approval
— see [`docs/agent-network.md`](docs/agent-network.md).

**Where's the real map on the Agent Map page?**
The current build ships a lightweight, built-in coordinate visualization
rather than a third-party map provider, to avoid a hard dependency on an
external map API key. See [`docs/architecture.md`](docs/architecture.md)
for the integration point for a production map provider.

**How do I report a bug or a security issue?**
Bugs: open a GitHub issue. Security vulnerabilities: email
security@celoht.com privately — see [`SECURITY.md`](SECURITY.md).
