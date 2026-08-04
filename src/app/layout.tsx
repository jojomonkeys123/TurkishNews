import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baslik = "Anchor Medya - Türkiye'nin Finans ve Ekonomi Gazetesi";
const aciklama =
  "Borsa, döviz, altın, makroekonomik gelişmeler ve iş dünyasından son dakika haberleri.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: baslik, template: "%s | Anchor Medya" },
  description: aciklama,
  openGraph: {
    title: baslik,
    description: aciklama,
    url: siteUrl,
    siteName: "Anchor Medya",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: baslik,
    description: aciklama,
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-slate-100">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
