import type { MetadataRoute } from "next";
import { getTumSlug, getTumYazarSlug } from "@/lib/sanity";
import { KATEGORILER } from "@/lib/kategoriler";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [makaleler, yazarlar] = await Promise.all([getTumSlug(), getTumYazarSlug()]);

  const statik: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "always", priority: 1 },
    { url: `${siteUrl}/hakkimizda`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/iletisim`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/reklam-politikasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/gizlilik`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/kullanim-kosullari`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/kvkk`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const yazarUrlleri: MetadataRoute.Sitemap = yazarlar.map((y) => ({
    url: `${siteUrl}/yazarlar/${y.slug}`,
    changeFrequency: "weekly",
    priority: 0.3,
  }));

  const kategoriUrlleri: MetadataRoute.Sitemap = KATEGORILER.map((k) => ({
    url: `${siteUrl}/${k.slug}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const makaleUrlleri: MetadataRoute.Sitemap = makaleler.map((m) => ({
    url: `${siteUrl}/${m.kategori}/${m.slug}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  return [...statik, ...kategoriUrlleri, ...yazarUrlleri, ...makaleUrlleri];
}
