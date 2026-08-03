import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { StaggerList, StaggerItem } from "./StaggerWrapper";
import { kategoriRenginiCoz, KATEGORI_RENK } from "@/lib/kategoriRenkleri";
import { kategoriAdi, formatSaat } from "@/lib/kategoriler";
import type { Makale } from "@/types";

const economyNews = [
  {
    category: "Ekonomi",
    headline: "Enflasyon Mayıs'ta Aylık Yüzde 2,3 Artarak 68,6'ya Geriledi",
    summary: "TÜİK verilerine göre tüketici fiyat endeksi yıllık bazda 2 puan düşerek 68,6 oldu.",
    image: "https://picsum.photos/seed/inflation-chart-economics/600/400",
    time: "12:44",
    author: "Murat Kaya",
  },
  {
    category: "Bankacılık",
    headline: "Bankacılık Sektörünün Net Karı İlk Çeyrekte 187 Milyar TL'ye Ulaştı",
    summary: "Kredi büyümesi ve faiz marjlarındaki iyileşme sektörün karlılığını destekledi.",
    image: "https://picsum.photos/seed/banking-sector-finance/600/400",
    time: "12:18",
    author: "Zeynep Arslan",
  },
  {
    category: "Yatırım",
    headline: "Yabancı Yatırımcılar Türk Hisse Senetlerinde 3 Haftadır Net Alıcı",
    summary: "Portföy girişleri son üç haftada toplamda 2,4 milyar dolara ulaştı.",
    image: "https://picsum.photos/seed/investment-portfolio-stocks/600/400",
    time: "11:53",
    author: "Burak Demir",
  },
];

const businessNews = [
  {
    category: "İş Dünyası",
    headline: "Sabancı Holding Avrupa Pazarına 1,2 Milyar Euro Yatırım Açıkladı",
    time: "11:30",
    image: "https://picsum.photos/seed/business-corporate-meeting/400/260",
  },
  {
    category: "Teknoloji",
    headline: "Türk Fintech Şirketi Papara Seri D Turunda 340 Milyon Dolar Topladı",
    time: "11:07",
    image: "https://picsum.photos/seed/fintech-startup-technology/400/260",
  },
  {
    category: "Tarım",
    headline: "Buğday Fiyatları Rekor Kırdı: Çiftçilere Müdahale Fiyatı Artırıldı",
    time: "10:45",
    image: "https://picsum.photos/seed/wheat-agriculture-farm/400/260",
  },
  {
    category: "İhracat",
    headline: "Mayıs İhracatı 24,8 Milyar Dolarla Rekor Seviyeye Ulaştı",
    time: "10:22",
    image: "https://picsum.photos/seed/export-cargo-ships/400/260",
  },
  {
    category: "Küresel",
    headline: "Fed Tutanakları: Yılın İkinci Yarısında İndirim Kapısı Aralık",
    time: "10:01",
    image: "https://picsum.photos/seed/federal-reserve-washington/400/260",
  },
];

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 bg-red-600 rounded-full" />
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
        Tümü <ArrowRight size={12} />
      </Link>
    </div>
  );
}

export default function NewsGrid({
  ekonomiHaberleri,
  oneCikanlar,
}: {
  ekonomiHaberleri?: Makale[];
  oneCikanlar?: Makale[];
}) {
  const anaListe = ekonomiHaberleri && ekonomiHaberleri.length > 0
    ? ekonomiHaberleri.slice(0, 3).map((m) => ({
        category: kategoriAdi(m.kategori),
        pill: KATEGORI_RENK[m.kategori].pill,
        headline: m.baslik,
        summary: m.ozet,
        image: m.kapakGorseli || "https://picsum.photos/seed/ekonomi-haber-fallback/600/400",
        time: formatSaat(m.yayinTarihi),
        author: `${m.yazar.ad} ${m.yazar.soyad}`,
        href: `/${m.kategori}/${m.slug}`,
      }))
    : economyNews.map((n) => ({ ...n, pill: kategoriRenginiCoz(n.category).pill, href: "#" }));

  const sidebarListe = oneCikanlar && oneCikanlar.length > 0
    ? oneCikanlar.slice(0, 5).map((m) => ({
        category: kategoriAdi(m.kategori),
        pill: KATEGORI_RENK[m.kategori].pill,
        headline: m.baslik,
        image: m.kapakGorseli || "https://picsum.photos/seed/ekonomi-haber-fallback-sm/400/260",
        time: formatSaat(m.yayinTarihi),
        href: `/${m.kategori}/${m.slug}`,
      }))
    : businessNews.map((n) => ({ ...n, pill: kategoriRenginiCoz(n.category).pill, href: "#" }));

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Main news column */}
        <div>
          <SectionHeader title="Ekonomi Haberleri" href="/ekonomi" />
          <StaggerList>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {anaListe.map((n, i) => (
                <StaggerItem key={i}>
                  <Link
                    href={n.href}
                    className="group img-zoom-parent card-press bg-white rounded overflow-hidden border border-slate-200 hover:border-slate-300 transition-[border-color] block h-full"
                  >
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <Image
                        src={n.image}
                        alt={n.headline}
                        fill
                        className="object-cover img-zoom"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                    <div className="p-3.5">
                      <span
                        className={`inline-block ${n.pill} text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm`}
                      >
                        {n.category}
                      </span>
                      <h3 className="text-slate-900 text-sm font-semibold leading-snug mt-2 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {n.headline}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                        {n.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Clock size={11} />
                          <span>{n.time}</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{n.author}</span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerList>
        </div>

        {/* Sidebar */}
        <div>
          <SectionHeader title="Öne Çıkanlar" href="/piyasalar" />
          <div className="bg-white rounded border border-slate-200 divide-y divide-slate-100">
            {sidebarListe.map((n, i) => (
              <Link
                key={i}
                href={n.href}
                className="group img-zoom-parent card-press flex gap-3 p-3 hover:bg-slate-50 transition-[background-color]"
              >
                <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded">
                  <Image
                    src={n.image}
                    alt={n.headline}
                    fill
                    className="object-cover img-zoom"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block ${n.pill} text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm`}
                  >
                    {n.category}
                  </span>
                  <h4 className="text-slate-900 text-xs font-semibold leading-snug mt-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {n.headline}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-1.5">
                    <Clock size={10} />
                    <span>{n.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
