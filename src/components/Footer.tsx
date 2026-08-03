import Link from "next/link";

const columns = [
  {
    title: "Haberler",
    links: [
      { ad: "Ekonomi", href: "/ekonomi" },
      { ad: "Piyasalar", href: "/piyasalar" },
      { ad: "Gündem", href: "/gundem" },
      { ad: "İş Dünyası", href: "/is-dunyasi" },
      { ad: "Yaşam", href: "/yasam" },
      { ad: "Politika", href: "/politika" },
      { ad: "Teknoloji", href: "/teknoloji" },
      { ad: "Küresel", href: "/kuresel" },
    ],
  },
  {
    title: "Piyasalar",
    links: [
      { ad: "Döviz", href: "/piyasalar" },
      { ad: "Borsa", href: "/piyasalar" },
      { ad: "Altın ve Emtia", href: "/piyasalar" },
      { ad: "Kripto", href: "/piyasalar" },
      { ad: "Tahvil", href: "/piyasalar" },
      { ad: "Endeksler", href: "/piyasalar" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { ad: "Hakkımızda", href: "/hakkimizda" },
      { ad: "İletişim", href: "/iletisim" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-6">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold mb-3">
              <span className="text-red-500">Ekonomi</span>
              <span className="text-white">Haber</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
              Türkiye'nin ekonomi ve finans gündemine tarafsız, bağımsız bakış.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.ad}>
                    <Link href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">
                      {l.ad}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            2026 Anchor Medya. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Gizlilik</Link>
            <Link href="/kullanim-kosullari" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Kullanım Koşulları</Link>
            <Link href="/kvkk" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">KVKK</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
