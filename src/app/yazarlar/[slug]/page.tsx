import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, EnvelopeSimple, LinkedinLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import Navbar from "@/components/Navbar";
import MarketBar from "@/components/MarketBar";
import Footer from "@/components/Footer";
import { getYazar, getYazarMakaleleri, getTumYazarSlug } from "@/lib/sanity";
import { kategoriAdi, formatTarih } from "@/lib/kategoriler";
import { KATEGORI_RENK } from "@/lib/kategoriRenkleri";

export async function generateStaticParams() {
  const slugs = await getTumYazarSlug();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yazar = await getYazar(slug);
  if (!yazar) return {};
  return {
    title: `${yazar.ad} ${yazar.soyad}`,
    description: yazar.bio || `${yazar.ad} ${yazar.soyad} — Anchor Medya`,
  };
}

export default async function YazarSayfasi({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yazar = await getYazar(slug);
  if (!yazar) notFound();

  const makaleler = await getYazarMakaleleri(slug, 24);

  return (
    <>
      <MarketBar />
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden bg-slate-200">
            {yazar.foto ? (
              <Image src={yazar.foto} alt={`${yazar.ad} ${yazar.soyad}`} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                {yazar.ad[0]}
                {yazar.soyad[0]}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl font-bold text-slate-900">
              {yazar.ad} {yazar.soyad}
            </h1>
            {yazar.unvan && <p className="text-sm text-red-600 font-medium mt-0.5">{yazar.unvan}</p>}
            {yazar.uzmanlik && (
              <p className="text-xs text-slate-400 mt-1">Uzmanlık: {yazar.uzmanlik}</p>
            )}
            {yazar.bio && <p className="text-sm text-slate-600 leading-relaxed mt-3 max-w-[640px]">{yazar.bio}</p>}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
              {yazar.email && (
                <a href={`mailto:${yazar.email}`} className="text-slate-400 hover:text-red-600 transition-colors">
                  <EnvelopeSimple size={18} />
                </a>
              )}
              {yazar.linkedin && (
                <a href={yazar.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                  <LinkedinLogo size={18} />
                </a>
              )}
              {yazar.twitter && (
                <a href={yazar.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                  <XLogo size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 mb-4">
          {yazar.ad} {yazar.soyad} Yazıları ({makaleler.length})
        </h2>

        {makaleler.length === 0 ? (
          <p className="text-slate-500 text-sm py-12 text-center">Henüz yayınlanmış makale yok.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {makaleler.map((m) => (
              <Link
                key={m._id}
                href={`/${m.kategori}/${m.slug}`}
                className="group img-zoom-parent card-press bg-white rounded overflow-hidden border border-slate-200 hover:border-slate-300 transition-[border-color] block"
              >
                {m.kapakGorseli && (
                  <div className="relative overflow-hidden aspect-[16/9]">
                    <Image
                      src={m.kapakGorseli}
                      alt={m.baslik}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                )}
                <div className="p-3.5">
                  <span
                    className={`inline-block ${KATEGORI_RENK[m.kategori].pill} text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm`}
                  >
                    {kategoriAdi(m.kategori)}
                  </span>
                  <h3 className="text-slate-900 text-sm font-semibold leading-snug mt-1.5 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {m.baslik}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock size={11} />
                    <span>{formatTarih(m.yayinTarihi)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
