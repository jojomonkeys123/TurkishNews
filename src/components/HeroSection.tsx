"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Clock, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { kategoriRenginiCoz, KATEGORI_RENK } from "@/lib/kategoriRenkleri";
import { kategoriAdi, formatSaat } from "@/lib/kategoriler";
import type { Makale } from "@/types";

const yedekSlaytlar = [
  {
    category: "Merkez Bankası",
    headline: "TCMB Faizi 47,5'te Sabit Tuttu: Enflasyon Beklentileri ve Yıl Sonu Görünümü",
    summary:
      "Para Politikası Kurulu, yüksek enflasyon ve küresel belirsizlikleri gerekçe göstererek politika faizini değiştirmedi. Piyasalar yılın son çeyreğinde indirim bekliyor.",
    image: "https://picsum.photos/seed/tcmb-ankara-building/1200/720",
    time: "14:22",
    author: "Aylin Demirci",
    href: "#",
  },
  {
    category: "Piyasalar",
    headline: "Borsa İstanbul 10.000 Puan Direncine Yaklaşıyor",
    summary: "BIST 100 endeksi, güçlü şirket bilançolarının desteğiyle tarihi zirveye doğru ilerliyor.",
    image: "https://picsum.photos/seed/istanbul-stock-exchange-wide/1200/720",
    time: "13:55",
    author: "Ekonomi Servisi",
    href: "#",
  },
  {
    category: "Küresel",
    headline: "Fed Tutanakları: Yılın İkinci Yarısında İndirim Kapısı Aralık",
    summary: "ABD Merkez Bankası'nın son toplantı tutanakları, faiz indirimi konusunda temkinli bir tavır sergiledi.",
    image: "https://picsum.photos/seed/federal-reserve-washington-wide/1200/720",
    time: "10:01",
    author: "Küresel Servis",
    href: "#",
  },
];

const yedekYanHaberler = [
  {
    category: "Piyasalar",
    headline: "Borsa İstanbul 10.000 Puan Direncine Yaklaşıyor",
    image: "https://picsum.photos/seed/istanbul-stock-exchange/400/260",
    time: "13:55",
    href: "#",
  },
  {
    category: "Döviz",
    headline: "Dolar Kurunda Haftalık En Düşük Seviye: 38,47 TL",
    image: "https://picsum.photos/seed/currency-dollars-turkey/400/260",
    time: "13:41",
    href: "#",
  },
  {
    category: "Gündem",
    headline: "Deprem Bölgesinde Yeniden Yapılanma Hız Kazandı",
    image: "https://picsum.photos/seed/turkey-reconstruction-city/400/260",
    time: "13:18",
    href: "#",
  },
  {
    category: "İş Dünyası",
    headline: "Koç Holding'in Net Karı Tahminlerin Yüzde 12 Üzerinde Geldi",
    image: "https://picsum.photos/seed/corporate-office-istanbul/400/260",
    time: "12:57",
    href: "#",
  },
];

const OTOMATIK_GECIS_MS = 6000;

export default function HeroSection({
  slaytlar,
  digerleri,
}: {
  slaytlar?: Makale[];
  digerleri?: Makale[];
}) {
  const reduce = useReducedMotion();

  const slaytListesi =
    slaytlar && slaytlar.length > 0
      ? slaytlar.map((m) => ({
          category: kategoriAdi(m.kategori),
          pill: KATEGORI_RENK[m.kategori].pill,
          headline: m.baslik,
          summary: m.ozet,
          image: m.kapakGorseli || "https://picsum.photos/seed/ekonomi-haber-fallback/1200/720",
          time: formatSaat(m.yayinTarihi),
          author: `${m.yazar.ad} ${m.yazar.soyad}`,
          href: `/${m.kategori}/${m.slug}`,
        }))
      : yedekSlaytlar.map((s) => ({ ...s, pill: kategoriRenginiCoz(s.category).pill }));

  const yanListesi =
    digerleri && digerleri.length > 0
      ? digerleri.slice(0, 4).map((m) => ({
          category: kategoriAdi(m.kategori),
          pill: KATEGORI_RENK[m.kategori].pill,
          headline: m.baslik,
          image: m.kapakGorseli || "https://picsum.photos/seed/ekonomi-haber-fallback-sm/400/260",
          time: formatSaat(m.yayinTarihi),
          href: `/${m.kategori}/${m.slug}`,
        }))
      : yedekYanHaberler.map((s) => ({ ...s, pill: kategoriRenginiCoz(s.category).pill }));

  const [aktif, setAktif] = useState(0);
  const toplam = slaytListesi.length;

  const sonraki = useCallback(() => setAktif((i) => (i + 1) % toplam), [toplam]);
  const onceki = useCallback(() => setAktif((i) => (i - 1 + toplam) % toplam), [toplam]);

  useEffect(() => {
    if (reduce || toplam <= 1) return;
    const zamanlayici = setInterval(sonraki, OTOMATIK_GECIS_MS);
    return () => clearInterval(zamanlayici);
  }, [reduce, toplam, sonraki, aktif]);

  const s = slaytListesi[aktif];

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 items-start">
          {/* Slider */}
          <div className="relative overflow-hidden rounded-xl shadow-lg shadow-slate-900/10 group">
            <div className="relative aspect-[16/9]">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={aktif}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0"
                >
                  <Link href={s.href} className="block w-full h-full">
                    <Image
                      src={s.image}
                      alt={s.headline}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 900px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
                <span
                  className={`inline-block ${s.pill} text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3 shadow-sm`}
                >
                  {s.category}
                </span>
                <Link href={s.href} className="pointer-events-auto">
                  <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2 max-w-[720px] drop-shadow-sm hover:text-slate-200 transition-colors">
                    {s.headline}
                  </h1>
                </Link>
                <p className="text-slate-200 text-sm leading-relaxed hidden md:block mb-3 max-w-[620px] line-clamp-2">
                  {s.summary}
                </p>
                <div className="flex items-center gap-3 text-slate-300 text-xs">
                  <Clock size={12} />
                  <span>{s.time}</span>
                  <span className="text-slate-500">|</span>
                  <span>{s.author}</span>
                </div>
              </div>

              {/* Ok kontrolleri */}
              {toplam > 1 && (
                <>
                  <button
                    onClick={onceki}
                    aria-label="Önceki haber"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/25 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
                  >
                    <CaretLeft size={20} weight="bold" />
                  </button>
                  <button
                    onClick={sonraki}
                    aria-label="Sonraki haber"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/25 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
                  >
                    <CaretRight size={20} weight="bold" />
                  </button>
                </>
              )}

              {/* Nokta göstergeleri */}
              {toplam > 1 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-2">
                  {slaytListesi.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setAktif(i)}
                      aria-label={`${i + 1}. slayt`}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i === aktif ? "w-9 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Secondary stories */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {yanListesi.map((y, i) => (
              <Link
                key={i}
                href={y.href}
                className="group/card img-zoom-parent card-press bg-white block rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col h-full">
                  <div className="relative overflow-hidden aspect-[16/9]">
                    <Image
                      src={y.image}
                      alt={y.headline}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 1024px) 50vw, 380px"
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <span
                      className={`inline-block ${y.pill} text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm`}
                    >
                      {y.category}
                    </span>
                    <h3 className="text-slate-900 text-sm font-semibold leading-snug mt-1.5 line-clamp-2 group-hover/card:text-red-600 transition-colors">
                      {y.headline}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-2">
                      <Clock size={11} />
                      <span>{y.time}</span>
                    </div>
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
