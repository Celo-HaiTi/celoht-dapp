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
    default: "CeloHT dApp",
    template: "%s — CeloHT dApp",
  },
  description:
    "The official CeloHT dApp: learn, connect with community agents, and support reforestation on the Celo ecosystem.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false }, // pre-launch: see docs/DEPLOYMENT.md
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
