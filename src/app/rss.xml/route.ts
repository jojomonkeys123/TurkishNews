import { getSonMakaleler } from "@/lib/sanity";
import { kategoriAdi } from "@/lib/kategoriler";

function xmlKac(metin: string): string {
  return metin
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const makaleler = await getSonMakaleler(30);

  const ogeler = makaleler
    .map((m) => {
      const url = `${siteUrl}/${m.kategori}/${m.slug}`;
      return `
    <item>
      <title>${xmlKac(m.baslik)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(m.yayinTarihi).toUTCString()}</pubDate>
      <category>${xmlKac(kategoriAdi(m.kategori))}</category>
      <description>${xmlKac(m.ozet)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anchor Medya</title>
    <link>${siteUrl}</link>
    <description>Türkiye'nin ekonomi ve finans gündemine tarafsız, bağımsız bakış.</description>
    <language>tr-TR</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${ogeler}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
}
