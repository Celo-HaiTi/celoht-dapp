import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Web3Gate } from "@/components/Web3Gate";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://celo-haiti.github.io/celoht-dapp/";
const BASE_PATH = process.env.GITHUB_PAGES === "true" || SITE_URL.includes("github.io") ? "/celoht-dapp" : "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
  default: "CeloHT — Digital Finance for Everyone",
    template: "%s | CeloHT",
  },
  description:
    "CeloHT is a Web3 financial, education, and impact platform powered by the Celo ecosystem.",
  keywords: ["CeloHT", "Celo", "USDm", "financial inclusion", "Web3 education", "reforestation"],
  openGraph: {
    title: "CeloHT — Digital Finance for Everyone",
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
    title: "CeloHT — Digital Finance for Everyone",
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
            <Footer />
            <BottomNav />
          </ToastProvider>
        </Web3Gate>
      </body>
    </html>
  );
}
