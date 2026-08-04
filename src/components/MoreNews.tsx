import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { kategoriAdi, formatSaat } from "@/lib/kategoriler";
import { KATEGORI_RENK } from "@/lib/kategoriRenkleri";
import type { Makale } from "@/types";

const yedekHaberler = [
  {
    category: "Ekonomi",
    headline: "Enflasyonla Mücadelede Kritik Dönemeç",
    image: "https://picsum.photos/seed/economy-fallback-1/400/260",
    time: "12:44",
    href: "#",
  },
  {
    category: "Piyasalar",
    headline: "Borsa Rallisi Sürdürülebilir mi?",
    image: "https://picsum.photos/seed/economy-fallback-2/400/260",
    time: "11:20",
    href: "#",
  },
  {
    category: "Küresel",
    headline: "Fed Kararları Türkiye'yi Nasıl Etkiler?",
    image: "https://picsum.photos/seed/economy-fallback-3/400/260",
    time: "10:05",
    href: "#",
  },
];

const yedekCanliTakip = [
  { time: "14:37", text: "BIST 100 günün en yüksek seviyesini test ediyor: 9.851 puan", href: "#" },
  { time: "14:21", text: "Hazine ve Maliye Bakanı basın toplantısı başladı", href: "#" },
  { time: "14:05", text: "Dolar kurunda TCMB müdahalesi iddiası piyasayı sarstı", href: "#" },
  { time: "13:48", text: "Petrol fiyatları OPEC toplantısı öncesi gerilemeye devam ediyor", href: "#" },
];

export default function MoreNews({
  digerHaberler,
  canliTakip,
}: {
  digerHaberler?: Makale[];
  canliTakip?: Makale[];
}) {
  const liste =
    digerHaberler && digerHaberler.length > 0
      ? digerHaberler.slice(0, 3).map((m) => ({
          category: kategoriAdi(m.kategori),
          pill: KATEGORI_RENK[m.kategori].pill,
          headline: m.baslik,
          image: m.kapakGorseli || "https://picsum.photos/seed/ekonomi-haber-fallback-more/400/260",
          time: formatSaat(m.yayinTarihi),
          href: `/${m.kategori}/${m.slug}`,
        }))
      : yedekHaberler.map((n) => ({ ...n, pill: "bg-slate-700" }));

  const liveUpdates =
    canliTakip && canliTakip.length > 0
      ? canliTakip.map((m) => ({
          time: formatSaat(m.yayinTarihi),
          text: m.baslik,
          href: `/${m.kategori}/${m.slug}`,
        }))
      : yedekCanliTakip;

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Diğer haberler */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h2 className="text-base font-bold text-slate-900">Diğer Gündem</h2>
            </div>
            <Link href="/gundem" className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
              Tümü <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liste.map((n, i) => (
              <Link
                key={i}
                href={n.href}
                className="group img-zoom-parent card-press bg-white border border-slate-200 rounded overflow-hidden hover:border-slate-300 transition-[border-color] block"
              >
                <div className="relative overflow-hidden aspect-[16/9]">
                  <Image
                    src={n.image}
                    alt={n.headline}
                    fill
                    className="object-cover img-zoom"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                <div className="p-3.5">
                  <span
                    className={`inline-block ${n.pill} text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm`}
                  >
                    {n.category}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug mt-2 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {n.headline}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock size={10} />
                    <span>{n.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Live updates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h2 className="text-base font-bold text-slate-900">Canlı Takip</h2>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            {liveUpdates.map((u, i) => (
              <Link key={i} href={u.href} className="card-press flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-[background-color]">
                <span className="font-mono text-[11px] text-slate-400 shrink-0 pt-0.5">{u.time}</span>
                <span className="text-xs text-slate-700 leading-relaxed line-clamp-2">{u.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
