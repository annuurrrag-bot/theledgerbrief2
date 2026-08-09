import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import RevealObserver from "@/components/RevealObserver";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://readledgerbrief.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Ledger Brief",
    template: "%s — The Ledger Brief",
  },
  description:
    "Independent investment research: weekly market intelligence, macro analysis, and long-term investment ideas.",
  icons: {
    icon: "/assets/logo/logo-app-icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "The Ledger Brief",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Ticker />
        <Header />
        {children}
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
