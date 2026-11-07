import { http, createConfig } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors/injected";
import { walletConnect } from "wagmi/connectors/walletConnect";
import { getMiniPayProvider } from "./lib/web3/minipay";
import { resolveWalletConnectProjectId } from "./lib/web3/walletconnect-project-id";

/**
 * WalletConnect requires a Project ID from https://cloud.reown.com
 * (formerly WalletConnect Cloud). Without one, the WalletConnect connector
 * (which is what makes Valora — a mobile-only wallet — connectable from a
 * desktop browser via QR code) is disabled. MiniPay connects through its
 * injected provider when the dApp is opened inside MiniPay.
 */
export const walletConnectProjectIdConfig = resolveWalletConnectProjectId(
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
);
const walletConnectProjectId = walletConnectProjectIdConfig.projectId;
const celoSepoliaRpcUrl = process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.celoht.com/";

const connectors = [
  injected({ shimDisconnect: true }),
  injected({
    shimDisconnect: true,
    target: () => {
      const provider = getMiniPayProvider();
      return provider ? { id: "minipay", name: "MiniPay", provider } : undefined;
    },
  }),
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
  chains: [celoSepolia],
  connectors,
  transports: {
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
