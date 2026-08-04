import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { kategoriAdi, formatSaat } from "@/lib/kategoriler";
import { KATEGORI_RENK } from "@/lib/kategoriRenkleri";
import type { Kategori, Makale } from "@/types";

export default function KategoriSeridi({
  kategori,
  makaleler,
}: {
  kategori: Kategori;
  makaleler: Makale[];
}) {
  if (!makaleler || makaleler.length === 0) return null;
  const renk = KATEGORI_RENK[kategori];

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-5 ${renk.bar} rounded-full`} />
          <h2 className="text-base font-bold text-slate-900">{kategoriAdi(kategori)}</h2>
        </div>
        <Link
          href={`/${kategori}`}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Tümü <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {makaleler.map((m) => (
          <Link
            key={m._id}
            href={`/${m.kategori}/${m.slug}`}
            className="group img-zoom-parent card-press relative block aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={m.kapakGorseli || "https://picsum.photos/seed/ekonomi-haber-serit/400/300"}
              alt={m.baslik}
              fill
              className="object-cover img-zoom"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Clock size={10} weight="bold" />
              {formatSaat(m.yayinTarihi)}
            </div>
            <h3 className="absolute bottom-0 left-0 right-0 p-2.5 text-white text-[13px] font-semibold leading-snug line-clamp-3 drop-shadow-sm">
              {m.baslik}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
