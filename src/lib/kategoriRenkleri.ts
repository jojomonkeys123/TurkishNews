import type { Kategori } from "@/types";

// Kategori bazlı rozet renkleri — marka kırmızısı (ekonomi/logo) korunuyor,
// diğer kategoriler haber ajansı konvansiyonlarına uygun ayrı renklerle ayrışıyor
// (piyasalar=mavi, is-dunyasi=amber, politika=mor, teknoloji=camgöbeği, kuresel=indigo,
// gundem=grafit, yasam=pembe).
export const KATEGORI_RENK: Record<Kategori, { pill: string; text: string; bar: string }> = {
  ekonomi: { pill: "bg-red-600", text: "text-red-600", bar: "bg-red-600" },
  piyasalar: { pill: "bg-blue-600", text: "text-blue-600", bar: "bg-blue-600" },
  gundem: { pill: "bg-slate-700", text: "text-slate-700", bar: "bg-slate-700" },
  "is-dunyasi": { pill: "bg-amber-600", text: "text-amber-600", bar: "bg-amber-600" },
  yasam: { pill: "bg-pink-600", text: "text-pink-600", bar: "bg-pink-600" },
  politika: { pill: "bg-violet-600", text: "text-violet-600", bar: "bg-violet-600" },
  teknoloji: { pill: "bg-cyan-600", text: "text-cyan-600", bar: "bg-cyan-600" },
  kuresel: { pill: "bg-indigo-600", text: "text-indigo-600", bar: "bg-indigo-600" },
};

// Henüz gerçek kategoriye bağlanmamış editoryal alt etiketler için en yakın
// üst kategoriye eşleme (ör. "Bankacılık" -> piyasalar mavisi).
const ALT_ETIKET_ESLEME: Record<string, Kategori> = {
  "merkez bankası": "ekonomi",
  bankacılık: "piyasalar",
  yatırım: "piyasalar",
  döviz: "piyasalar",
  tarım: "ekonomi",
  ihracat: "is-dunyasi",
  enerji: "ekonomi",
  sağlık: "yasam",
  spor: "gundem",
  magazin: "yasam",
};

const TR_HARF: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", i̇: "i" };

function slugleştir(etiket: string): string {
  return etiket
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşüi̇]/g, (c) => TR_HARF[c] || c)
    .trim()
    .replace(/\s+/g, "-");
}

export function kategoriRenginiCoz(etiket: string): { pill: string; text: string; bar: string } {
  const slug = slugleştir(etiket);
  if (slug in KATEGORI_RENK) return KATEGORI_RENK[slug as Kategori];
  const dupSuz = etiket.toLocaleLowerCase("tr-TR").trim();
  if (dupSuz in ALT_ETIKET_ESLEME) return KATEGORI_RENK[ALT_ETIKET_ESLEME[dupSuz]];
  return KATEGORI_RENK.ekonomi;
}
