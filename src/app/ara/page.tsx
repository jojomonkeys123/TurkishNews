import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Navbar from "@/components/Navbar";
import MarketBar from "@/components/MarketBar";
import Footer from "@/components/Footer";
import { aramaYap } from "@/lib/sanity";
import { kategoriAdi, formatTarih } from "@/lib/kategoriler";
import { KATEGORI_RENK } from "@/lib/kategoriRenkleri";

export const metadata: Metadata = {
  title: "Arama Sonuçları | Anchor Medya",
  robots: { index: false, follow: true },
};

export default async function AramaSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const sorgu = (q || "").trim();
  const sonuclar = sorgu ? await aramaYap(sorgu) : [];

  return (
    <>
      <MarketBar />
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <MagnifyingGlass size={20} className="text-slate-400" />
          <h1 className="text-xl font-bold text-slate-900">
            {sorgu ? <>&quot;{sorgu}&quot; için arama sonuçları</> : "Haber Ara"}
          </h1>
        </div>
        {sorgu && (
          <p className="text-sm text-slate-500 mb-6">{sonuclar.length} sonuç bulundu</p>
        )}

        {!sorgu && (
          <p className="text-slate-500 text-sm py-12 text-center">
            Aramak istediğiniz kelimeyi üstteki arama kutusuna yazın.
          </p>
        )}

        {sorgu && sonuclar.length === 0 && (
          <p className="text-slate-500 text-sm py-12 text-center">
            &quot;{sorgu}&quot; için sonuç bulunamadı. Farklı bir kelimeyle tekrar deneyin.
          </p>
        )}

        {sonuclar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sonuclar.map((m) => (
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
                  <h2 className="text-slate-900 text-sm font-semibold leading-snug mt-1.5 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {m.baslik}
                  </h2>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {m.ozet}
                  </p>
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
