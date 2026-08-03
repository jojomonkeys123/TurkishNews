import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import MarketBar from "@/components/MarketBar";
import Footer from "@/components/Footer";
import { getMakale, getIlgiliMakeleler, getTumSlug } from "@/lib/sanity";
import { KATEGORILER, kategoriAdi, formatTarih } from "@/lib/kategoriler";
import { KATEGORI_RENK } from "@/lib/kategoriRenkleri";

export async function generateStaticParams() {
  const slugs = await getTumSlug();
  return slugs.map(({ kategori, slug }) => ({ kategori, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string; slug: string }>;
}): Promise<Metadata> {
  const { kategori, slug } = await params;
  const makale = await getMakale(kategori, slug);
  if (!makale) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/${kategori}/${slug}`;
  const baslik = makale.metaBaslik || makale.baslik;
  const aciklama = makale.metaAciklama || makale.ozet;

  return {
    title: baslik,
    description: aciklama,
    alternates: { canonical: url },
    openGraph: {
      title: baslik,
      description: aciklama,
      url,
      type: "article",
      publishedTime: makale.yayinTarihi,
      authors: [`${makale.yazar.ad} ${makale.yazar.soyad}`],
      images: makale.kapakGorseli ? [{ url: makale.kapakGorseli }] : undefined,
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title: baslik,
      description: aciklama,
      images: makale.kapakGorseli ? [makale.kapakGorseli] : undefined,
    },
  };
}

export default async function MakaleSayfasi({
  params,
}: {
  params: Promise<{ kategori: string; slug: string }>;
}) {
  const { kategori, slug } = await params;

  if (!KATEGORILER.some((k) => k.slug === kategori)) notFound();

  const makale = await getMakale(kategori, slug);
  if (!makale) notFound();

  const ilgili = await getIlgiliMakeleler(kategori, slug, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: makale.baslik,
    description: makale.ozet,
    image: makale.kapakGorseli ? [makale.kapakGorseli] : undefined,
    datePublished: makale.yayinTarihi,
    dateModified: makale.yayinTarihi,
    author: [
      {
        "@type": "Person",
        name: `${makale.yazar.ad} ${makale.yazar.soyad}`,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Anchor Medya",
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.ico` },
    },
    mainEntityOfPage: `${siteUrl}/${kategori}/${slug}`,
    articleSection: kategoriAdi(kategori),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketBar />
      <Navbar />
      <main className="max-w-[820px] mx-auto px-4 py-8">
        <Link
          href={`/${makale.kategori}`}
          className={`inline-block ${KATEGORI_RENK[makale.kategori].pill} text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm`}
        >
          {kategoriAdi(makale.kategori)}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mt-3 mb-4">
          {makale.baslik}
        </h1>
        <p className="text-slate-600 text-base leading-relaxed mb-5">{makale.ozet}</p>

        <div className="flex items-center gap-3 text-slate-400 text-xs pb-5 border-b border-slate-200">
          <Clock size={12} />
          <span>{formatTarih(makale.yayinTarihi)}</span>
          <span className="text-slate-300">|</span>
          <span>
            {makale.yazar.ad} {makale.yazar.soyad}
          </span>
        </div>

        {makale.kapakGorseli && (
          <div className="relative w-full aspect-[16/9] my-6 overflow-hidden rounded">
            <Image src={makale.kapakGorseli} alt={makale.baslik} fill className="object-cover" priority />
          </div>
        )}

        <article className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-red-600">
          <PortableText value={makale.icerik} />
        </article>

        {makale.finansalIcerik && (
          <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded p-4 mt-8 text-amber-900 text-xs leading-relaxed">
            <WarningCircle size={18} className="shrink-0 mt-0.5" />
            <p>
              Bu içerik yatırım tavsiyesi değildir. Burada yer alan bilgiler genel bilgilendirme
              amaçlıdır ve herhangi bir yatırım aracının alım-satımına yönelik bir teklif ya da
              öneri içermez. Yatırım kararlarınızı almadan önce bağımsız bir uzmana danışmanız
              önerilir.
            </p>
          </div>
        )}

        {makale.etiketler && makale.etiketler.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {makale.etiketler.map((t) => (
              <span
                key={t}
                className="text-[11px] text-slate-500 bg-slate-100 rounded-full px-3 py-1"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {ilgili.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">İlgili Haberler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ilgili.map((m) => (
                <Link
                  key={m._id}
                  href={`/${m.kategori}/${m.slug}`}
                  className="group flex gap-3 bg-white rounded overflow-hidden border border-slate-200 hover:border-slate-300 transition-[border-color] p-3"
                >
                  {m.kapakGorseli && (
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded">
                      <Image src={m.kapakGorseli} alt={m.baslik} fill className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span
                      className={`inline-block ${KATEGORI_RENK[m.kategori].pill} text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm`}
                    >
                      {kategoriAdi(m.kategori)}
                    </span>
                    <h3 className="text-slate-900 text-sm font-semibold leading-snug mt-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {m.baslik}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
