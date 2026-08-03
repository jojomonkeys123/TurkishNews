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

export function formatTarih(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSaat(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}
