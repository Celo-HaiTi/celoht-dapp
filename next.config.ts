import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * The dApp's CSP is necessarily looser than a static marketing site's:
 * wallet connections (WalletConnect relay, injected providers) and RPC
 * calls (Celo/Alfajores nodes, and whichever provider a user's wallet
 * uses) both happen over arbitrary HTTPS/WSS origins that aren't knowable
 * in advance. We still lock down script-src, frame-ancestors, and
 * object-src tightly. See docs/SECURITY.md.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      // See the matching comment on the `webpack` config below.
      "@coinbase/cdp-sdk": { browser: "./src/lib/web3/empty-module.js" },
      "@base-org/account": { browser: "./src/lib/web3/empty-module.js" },
    },
  },
  webpack: (config) => {
    // We only use the `injected` and `walletConnect` connectors from
    // @wagmi/connectors, but that package's single barrel export pulls in
    // every connector, including Coinbase's Base Account / Smart Wallet
    // connector and its optional `@x402/*` payment-protocol dependencies,
    // which aren't installed and aren't needed. Alias them out rather
    // than installing dependencies for a feature this app doesn't use.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@coinbase/cdp-sdk": false,
      "@base-org/account": false,
    };
    return config;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
