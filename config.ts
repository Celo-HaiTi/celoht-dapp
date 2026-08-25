import { http, createConfig } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

/**
 * WalletConnect requires a Project ID from https://cloud.reown.com
 * (formerly WalletConnect Cloud). Without one, the WalletConnect connector
 * (which is what makes Valora — a mobile-only wallet — connectable from a
 * desktop browser via QR code) is disabled and only browser-injected
 * wallets are offered. See docs/DEVELOPMENT.md and .env.example.
 */
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
const celoRpcUrl = process.env.NEXT_PUBLIC_CELO_RPC_URL || undefined;
const celoSepoliaRpcUrl = process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL || undefined;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://celo-haiti.github.io/celoht-dapp/";

const connectors = [
  injected({ shimDisconnect: true }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          metadata: {
            name: "CeloHT",
            description: "CeloHT dApp — education, agent network, and reforestation on Celo.",
            url: appUrl,
            icons: [`${appUrl.replace(/\/$/, "")}/celoht-logo.png`],
          },
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  connectors,
  transports: {
    [celo.id]: http(celoRpcUrl),
    [celoSepolia.id]: http(celoSepoliaRpcUrl),
  },
  ssr: true,
});

export const isWalletConnectConfigured = Boolean(walletConnectProjectId);

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
