# CeloHT dApp

This project is configured for GitHub Pages hosting at:

https://celoht-dapp.github.io/

## Run locally

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
GITHUB_PAGES=true REPO_NAME=celoht-dapp npm run build
```

The exported static site is generated in the `out/` directory.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub, enable Pages from the `gh-pages` branch or use a GitHub Action.
3. Publish the generated `out/` folder.

## Notes

This is a demo/front-end presentation app. It is intentionally designed to show product flow and UI without pretending to be a live production blockchain deployment.
