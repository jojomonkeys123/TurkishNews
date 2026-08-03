import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const opinionPieces = [
  {
    author: "Prof. Dr. Selim Yıldız",
    role: "Ekonomist, ODTÜ",
    headline: "Enflasyonla Mücadelede Kritik Dönemece Giriyoruz",
    excerpt: "Merkez Bankası'nın son kararları gelecek çeyrek için belirleyici olacak.",
    avatar: "https://picsum.photos/seed/professor-economist-man/80/80",
    time: "Bugün",
  },
  {
    author: "Nilüfer Şahin",
    role: "Finans Analisti",
    headline: "Borsa Rallisi Sürdürülebilir mi?",
    excerpt: "Teknik göstergeler ve temel veriler farklı sinyaller veriyor.",
    avatar: "https://picsum.photos/seed/female-analyst-finance/80/80",
    time: "Dün",
  },
  {
    author: "Emre Çelik",
    role: "Küresel Strateji Uzmanı",
    headline: "Fed Kararları Türkiye'yi Nasıl Etkiler?",
    excerpt: "Küresel likidite koşullarındaki değişim gelişmekte olan piyasaları yeniden şekillendiriyor.",
    avatar: "https://picsum.photos/seed/strategy-expert-suit/80/80",
    time: "2 gün önce",
  },
];

const liveUpdates = [
  { time: "14:37", text: "BIST 100 günün en yüksek seviyesini test ediyor: 9.851 puan" },
  { time: "14:21", text: "Hazine ve Maliye Bakanı basın toplantısı başladı" },
  { time: "14:05", text: "Dolar kurunda TCMB müdahalesi iddiası piyasayı sarstı" },
  { time: "13:48", text: "Petrol fiyatları OPEC toplantısı öncesi gerilemeye devam ediyor" },
  { time: "13:31", text: "Avrupa borsaları günü kırmızıyla tamamlamaya hazırlanıyor" },
  { time: "13:14", text: "Altın ons fiyatı 3.280 dolar sınırında dalgalanıyor" },
  { time: "12:55", text: "Türkiye cari açığı Nisan'da 5,1 milyar dolar olarak açıklandı" },
  { time: "12:37", text: "Moody's Türkiye için kredi görünümü toplantısı yapıyor" },
];

export default function MoreNews() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Opinion pieces */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h2 className="text-base font-bold text-slate-900">Köşe Yazıları</h2>
            </div>
            <Link href="#" className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
              Tümü <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {opinionPieces.map((p, i) => (
              <Link key={i} href="#" className="group card-press bg-white border border-slate-200 rounded p-4 hover:border-slate-300 transition-[border-color] block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={p.avatar} alt={p.author} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 leading-tight">{p.author}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{p.role}</div>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2 group-hover:text-red-600 transition-colors">
                  {p.headline}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.excerpt}</p>
                <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-3">
                  <Clock size={10} />
                  <span>{p.time}</span>
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
              <Link key={i} href="#" className="card-press flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-[background-color]">
                <span className="font-mono text-[11px] text-slate-400 shrink-0 pt-0.5">{u.time}</span>
                <span className="text-xs text-slate-700 leading-relaxed">{u.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
