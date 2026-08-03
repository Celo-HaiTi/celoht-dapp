# Privacy Policy

## What This App Collects

### On-chain data (public by nature)

Any interaction with the smart contracts in this repository — registering
as an agent, donating, voting, receiving a certificate — is recorded on
the Celo blockchain and is inherently public. This isn't specific to
CeloHT; it's how any public blockchain works. Don't submit information
on-chain that you don't want to be permanently public.

### Off-chain data

- **Local browser storage**: theme preference and notification
  preferences (see the Settings page) are stored in your browser's
  `localStorage` and never transmitted to a server.
- **Agent profile metadata**: if you register as an agent, the metadata
  URI you provide (name, region, services) may be stored off-chain (e.g.
  on IPFS) and is intentionally public, since it's how other users find
  you.
- **Supabase-backed features** (course content, extended profiles,
  partner directory): if/when configured, see
  [`docs/api.md`](docs/api.md) for the schema. This app runs without a
  live Supabase project by default — see `apps/web/src/lib/data/README.md`.

### What we don't collect

- No tracking cookies or third-party analytics are included in this
  codebase.
- We never ask for, and this app never transmits, your seed phrase or
  private key.

## Third Parties

Connecting a wallet may share your address with:

- **Your wallet provider** (e.g. Valora), which you already trust
- **WalletConnect's relay infrastructure**, if you connect via
  WalletConnect
- **RPC providers**, when the app reads on-chain data on your behalf

None of these are operated by CeloHT.

## Your Rights

Since on-chain data is immutable and public by design, it can't be
deleted by CeloHT. Off-chain data stored in your browser can be cleared
at any time through your browser's settings.

## Contact

Privacy questions: privacy@celoht.com

## Changes to This Policy

Changes follow the governance process in [`GOVERNANCE.md`](GOVERNANCE.md)
and are recorded in [`CHANGELOG.md`](CHANGELOG.md).
