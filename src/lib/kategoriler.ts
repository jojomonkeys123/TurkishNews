import type { Kategori } from "@/types";

export const KATEGORILER: { slug: Kategori; ad: string }[] = [
  { slug: "piyasalar", ad: "Piyasalar" },
  { slug: "ekonomi", ad: "Ekonomi" },
  { slug: "gundem", ad: "Gündem" },
  { slug: "is-dunyasi", ad: "İş Dünyası" },
  { slug: "yasam", ad: "Yaşam" },
  { slug: "politika", ad: "Politika" },
  { slug: "teknoloji", ad: "Teknoloji" },
  { slug: "kuresel", ad: "Küresel" },
];

export function kategoriAdi(slug: string): string {
  return KATEGORILER.find((k) => k.slug === slug)?.ad ?? slug;
}

// timeZone açıkça belirtiliyor — aksi halde sunucu (UTC) ve tarayıcı (ziyaretçinin
// yerel saati) aynı ISO zaman damgası için farklı saatler üretir, bu da React'te
// hydration hatasına (#418) yol açar. Türkiye saati sabitlenerek hem tutarlılık
// hem de editoryal doğruluk sağlanıyor.
const TR_ZAMAN_DILIMI = "Europe/Istanbul";

export function formatTarih(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TR_ZAMAN_DILIMI,
  });
}

export function formatSaat(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: TR_ZAMAN_DILIMI });
}
