import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Web3Gate } from "@/components/Web3Gate";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { BottomNav } from "@/components/BottomNav";
import { I18nProvider } from "@/lib/i18n/context";
import { PilotNotice } from "@/components/PilotNotice";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://app.celoht.com").replace(/\/$/, "");
const BASE_PATH = process.env.GITHUB_PAGES === "true" || APP_URL.includes("github.io") ? "/celoht-dapp" : "";
const ICON_VERSION = "2026-11-07";
const buildAssetUrl = (assetPath: string) => {
  const normalizedAssetPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return new URL(`${BASE_PATH}${normalizedAssetPath}${normalizedAssetPath.includes("?") ? "" : `?v=${ICON_VERSION}`}`, `${APP_URL}/`).toString();
};
const LOGO_URL = buildAssetUrl("/celoht-logo.png");

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: "CeloHT",
  title: {
    default: "CeloHT",
    template: "%s | CeloHT",
  },
  description:
    "CeloHT is a Web3 financial, education, and impact platform powered by the Celo ecosystem.",
  keywords: ["CeloHT", "Celo", "USDm", "financial inclusion", "Web3 education", "reforestation"],
  manifest: buildAssetUrl("/manifest.json"),
  icons: {
    icon: [
      { url: buildAssetUrl("/favicon-32x32.png"), sizes: "32x32", type: "image/png" },
      { url: buildAssetUrl("/favicon-16x16.png"), sizes: "16x16", type: "image/png" },
      { url: buildAssetUrl("/favicon.ico"), rel: "shortcut icon" },
    ],
    apple: [{ url: buildAssetUrl("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "CeloHT",
    description:
      "A community-driven Celo app for accessible wallets, learning, and environmental impact.",
    url: APP_URL,
    siteName: "CeloHT",
    type: "website",
    images: [
      {
        url: LOGO_URL,
        width: 998,
        height: 1000,
        alt: "CeloHT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CeloHT",
    description:
      "A community-driven Celo app for accessible wallets, learning, and environmental impact.",
    images: [LOGO_URL],
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    title: "CeloHT",
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ht" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0B1120" />
        <meta name="apple-mobile-web-app-title" content="CeloHT" />
        <meta name="application-name" content="CeloHT" />
        <link rel="icon" href={buildAssetUrl("/favicon.ico")} type="image/x-icon" sizes="any" />
        <link rel="icon" href={buildAssetUrl("/favicon-32x32.png")} type="image/png" sizes="32x32" />
        <link rel="icon" href={buildAssetUrl("/favicon-16x16.png")} type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href={buildAssetUrl("/apple-touch-icon.png")} type="image/png" sizes="180x180" />
        <link rel="manifest" href={buildAssetUrl("/manifest.json")} />
      </head>
      <body className="bg-navy-950 font-body text-parchment antialiased">
        <Web3Gate>
          <I18nProvider>
            <ToastProvider>
              <SkipLink />
              <Header />
              <PilotNotice />
              <main id="main-content" className="lg:ml-64">
                {children}
              </main>
              <BottomNav />
            </ToastProvider>
          </I18nProvider>
        </Web3Gate>
      </body>
    </html>
  );
}
