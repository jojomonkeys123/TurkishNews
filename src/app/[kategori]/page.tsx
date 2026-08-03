import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import Navbar from "@/components/Navbar";
import MarketBar from "@/components/MarketBar";
import Footer from "@/components/Footer";
import { getKategoriMakeleriSayfa, countKategoriMakeleri } from "@/lib/sanity";
import { KATEGORILER, kategoriAdi, formatTarih } from "@/lib/kategoriler";
import { KATEGORI_RENK } from "@/lib/kategoriRenkleri";

const PAGE_SIZE = 12;

export function generateStaticParams() {
  return KATEGORILER.map((k) => ({ kategori: k.slug }));
}

export default async function KategoriSayfasi({
  params,
  searchParams,
}: {
  params: Promise<{ kategori: string }>;
  searchParams: Promise<{ sayfa?: string }>;
}) {
  const { kategori } = await params;
  const { sayfa } = await searchParams;

  if (!KATEGORILER.some((k) => k.slug === kategori)) notFound();

  const page = Math.max(1, parseInt(sayfa || "1", 10) || 1);
  const [makaleler, toplam] = await Promise.all([
    getKategoriMakeleriSayfa(kategori, page, PAGE_SIZE),
    countKategoriMakeleri(kategori),
  ]);
  const toplamSayfa = Math.max(1, Math.ceil(toplam / PAGE_SIZE));

  return (
    <>
      <MarketBar />
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-1 h-6 rounded-full ${KATEGORI_RENK[kategori as keyof typeof KATEGORI_RENK].bar}`} />
          <h1 className="text-xl font-bold text-slate-900">{kategoriAdi(kategori)}</h1>
        </div>

        {makaleler.length === 0 ? (
          <p className="text-slate-500 text-sm py-12 text-center">
            Bu kategoride henüz yayınlanmış makale yok.
          </p>
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

        {toplamSayfa > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/${kategori}?sayfa=${p}`}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                  p === page
                    ? "bg-red-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
