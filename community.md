# Community

The `/community` page displays only HTTPS URLs supplied through the verified
community environment variables. The current verified channels are:

- GitHub: `https://github.com/Celo-HaiTi`
- Discord: `https://discord.gg/Xcx6c9bBD2`
- Telegram: `https://t.me/celoht_celoht_haiti`
- LinkedIn: `https://www.linkedin.com/company/celoht/`

GitHub is the current Celo-HaiTi organization. The Discord invite resolves to
a server named CeloHT whose public description identifies it as the official
CeloHT community. The Telegram page is titled CeloHT. The LinkedIn URL is the
CeloHT organization page and identifies CeloHT in its public metadata.

Facebook, Instagram, X, and Medium remain unconfigured because the current
official documentation provides handles or platform names, but no verified
organization/profile URLs for this deployment.

Maintainers can update a verified channel by setting its `COMMUNITY_*_URL`
variable in the GitHub Pages build environment. Invalid or non-HTTPS values
are rejected by the frontend configuration and are not rendered as buttons.

## Contributing to This Repository Specifically

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for how to contribute code
to the dApp itself, as distinct from participating in CeloHT's broader
community programs (education sessions, agent network, reforestation
events), which are documented in the flagship repository.

## Governance Participation

Community members granted `VOTER_ROLE` on `GovernanceVoting` can vote
directly through the `/governance` page — see
[`governance.md`](governance.md) and
[`../packages/contracts/contracts/GovernanceVoting.sol`](../packages/contracts/contracts/GovernanceVoting.sol).
