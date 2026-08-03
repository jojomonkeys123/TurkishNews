import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
const baslik = "EkonomiHaber - Türkiye'nin Finans ve Ekonomi Gazetesi";
const aciklama =
  "Borsa, döviz, altın, makroekonomik gelişmeler ve iş dünyasından son dakika haberleri.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: baslik, template: "%s | EkonomiHaber" },
  description: aciklama,
  openGraph: {
    title: baslik,
    description: aciklama,
    url: siteUrl,
    siteName: "EkonomiHaber",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: baslik,
    description: aciklama,
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
      <body className="min-h-screen bg-slate-100">{children}</body>
    </html>
  );
}
