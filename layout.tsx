import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Web3Gate } from "@/components/Web3Gate";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://celo-haiti.github.io/celoht-dapp/";
const BASE_PATH = process.env.GITHUB_PAGES === "true" || SITE_URL.includes("github.io") ? "/celoht-dapp" : "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
  default: "CeloHT dApp — Celo Web3 & Impact",
    template: "%s | CeloHT",
  },
  description:
    "Use the CeloHT dApp to interact with the Celo ecosystem, manage supported assets, learn Web3 and participate in CeloHT's real-world impact initiatives.",
  keywords: ["CeloHT", "Celo", "USDm", "financial inclusion", "Web3 education", "reforestation"],
  openGraph: {
    title: "CeloHT dApp — Celo Web3 & Impact",
    description:
      "A community-driven Celo app for accessible wallets, learning, and environmental impact.",
    url: SITE_URL,
    siteName: "CeloHT",
    type: "website",
    images: [
      {
        url: "/celoht-logo.png",
        width: 998,
        height: 1000,
        alt: "CeloHT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CeloHT dApp — Celo Web3 & Impact",
    description:
      "A community-driven Celo app for accessible wallets, learning, and environmental impact.",
    images: ["/celoht-logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={`${BASE_PATH}/favicon.svg`} type="image/svg+xml" />
        <link rel="icon" href={`${BASE_PATH}/favicon.ico`} />
        <link rel="apple-touch-icon" href={`${BASE_PATH}/celoht-logo.png`} />
        <link rel="manifest" href={`${BASE_PATH}/manifest.json`} />
      </head>
      <body className="bg-navy-950 font-body text-parchment antialiased">
        <Web3Gate>
          <ToastProvider>
            <SkipLink />
            <Header />
            <main id="main-content">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </ToastProvider>
        </Web3Gate>
      </body>
    </html>
  );
}
