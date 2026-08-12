import type { NextConfig } from "next";

const repoName = process.env.REPO_NAME || "celoht-dapp";
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      "@coinbase/cdp-sdk": { browser: "./src/lib/web3/empty-module.js" },
      "@base-org/account": { browser: "./src/lib/web3/empty-module.js" },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@coinbase/cdp-sdk": false,
      "@base-org/account": false,
    };
    return config;
  },
};

export default nextConfig;
