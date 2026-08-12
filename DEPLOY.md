# 🚀 Deploy CeloHT dApp — Quick Start for Investors

This guide gets you a live demo URL in **under 2 minutes**.

## Option 1: One-Click Deploy (Recommended for Investors)

Click the button below to deploy the dApp live on Vercel (free):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCelo-HaiTi%2Fceloht-dapp&project-name=celoht-dapp&repository-name=celoht-dapp&env=NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID&envDescription=Get%20a%20free%20WalletConnect%20project%20ID%20at%20https%3A%2F%2Fcloud.walletconnect.com)

**Steps:**
1. Click the button above
2. Sign in with GitHub (or create a free Vercel account)
3. Click "Deploy"
4. Wait ~2 minutes
5. ✅ Your live dApp URL will appear (e.g., `https://celoht-dapp.vercel.app`)

### Optional: Add WalletConnect (Mobile Wallet Support)

To enable QR-code wallet connections on mobile:

1. Get a free WalletConnect Project ID at https://cloud.walletconnect.com
2. In Vercel dashboard → **Settings** → **Environment Variables**
3. Add: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your-id>`
4. Redeploy

---

## Option 2: Run Locally

```bash
git clone https://github.com/celo-ht/dapp.git
cd dapp
npm install
npm run dev
```

Opens at **http://localhost:3000**

---

## Option 3: Deploy to Netlify

1. Fork this repo to your GitHub
2. Go to https://app.netlify.com/start
3. Connect your fork
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Deploy!

---

## What Runs on the Demo?

All routes are **static and pre-built**, so no backend server is needed:

| Route | Feature |
|-------|---------|
| `/` | Overview + demo portfolio |
| `/wallet` | Send/receive with balance display |
| `/exchange` | Swap CELO ↔ cUSD (demo rates) |
| `/education` | Courses + certificates |
| `/agents` | Community agent directory |
| `/governance` | Voting interface (sample proposals) |
| `/impact` | Reforestation metrics |

**All demo data is clearly labeled.** No false claims about blockchain activity.

---

## Environment Variables (Optional)

For development or custom deployments, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The only **required** env var is:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (optional, for mobile wallets)

Everything else has defaults or is used only for local Hardhat contract testing.

---

## Troubleshooting

**"Build failed":**
- Check Node version: `node --version` (need 18+)
- Try: `npm ci && npm run build`

**"WalletConnect not working":**
- That's expected without a Project ID. Demo mode still works!
- Add the ID in Vercel environment variables to enable mobile wallets.

**"I want to connect to real Celo contracts":**
- See [docs/deployment.md](docs/deployment.md) for contract deployment & integration steps.

---

## Next Steps

Once deployed:
1. **Share the live URL** with investors/stakeholders
2. **Test on mobile** (use Valora or MiniPay if WalletConnect is set up)
3. **Customize** — Update copy, branding, demo data in [lib/demo-data.ts](lib/demo-data.ts)
4. **Integrate real contracts** when ready (see [docs/deployment.md](docs/deployment.md))

---

**Need help?** Open an issue at [github.com/celo-ht/dapp](https://github.com/celo-ht/dapp/issues)
