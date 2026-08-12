import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { Web3Gate } from "@/components/Web3Gate";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const SITE_URL = "https://app.celoht.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CeloHT — Financial Inclusion, Web3 Education & Environmental Impact",
    template: "%s | CeloHT",
  },
  description:
    "CeloHT brings financial inclusion, digital finance education, and community impact together on the Celo ecosystem.",
  keywords: ["CeloHT", "Celo", "cUSD", "financial inclusion", "Web3 education", "reforestation"],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "CeloHT — Financial Inclusion, Web3 Education & Environmental Impact",
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
    title: "CeloHT — Financial Inclusion, Web3 Education & Environmental Impact",
    description:
      "A community-driven Celo app for accessible wallets, learning, and environmental impact.",
    images: ["/celoht-logo.png"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-parchment font-body text-ink dark:bg-navy-950 dark:text-parchment-100 antialiased">
        <ThemeProvider>
          <Web3Gate>
            <ToastProvider>
              <SkipLink />
              <Header />
              <main id="main-content">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
              <Footer />
            </ToastProvider>
          </Web3Gate>
        </ThemeProvider>
      </body>
    </html>
  );
}
