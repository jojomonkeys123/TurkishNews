"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, List, X } from "@phosphor-icons/react";

const categories = [
  { label: "Piyasalar", href: "/piyasalar" },
  { label: "Ekonomi", href: "/ekonomi" },
  { label: "Gündem", href: "/gundem" },
  { label: "İş Dünyası", href: "/is-dunyasi" },
  { label: "Yaşam", href: "/yasam" },
  { label: "Politika", href: "/politika" },
  { label: "Teknoloji", href: "/teknoloji" },
  { label: "Küresel", href: "/kuresel" },
];

export default function Navbar() {
  const [mobilAcik, setMobilAcik] = useState(false);
  const [aramaAcik, setAramaAcik] = useState(false);
  const [sorgu, setSorgu] = useState("");
  const router = useRouter();

  function aramaGonder(e: React.FormEvent) {
    e.preventDefault();
    const q = sorgu.trim();
    if (!q) return;
    setAramaAcik(false);
    setMobilAcik(false);
    router.push(`/ara?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-6">
          <Link href="/" className="shrink-0">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-red-600">Anchor</span>
              <span className="text-slate-900">Medya</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0 overflow-x-auto">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 whitespace-nowrap transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAramaAcik((v) => !v)}
              aria-label="Ara"
              aria-expanded={aramaAcik}
              className="btn-icon p-2 text-slate-500 hover:text-slate-900 rounded"
            >
              <MagnifyingGlass size={18} />
            </button>
            <Link
              href="/#bulten"
              className="btn-subscribe hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
            >
              Abone Ol
            </Link>
            <button
              onClick={() => setMobilAcik((v) => !v)}
              aria-label={mobilAcik ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobilAcik}
              className="btn-icon lg:hidden p-2 text-slate-500 hover:text-slate-900"
            >
              {mobilAcik ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {aramaAcik && (
          <form onSubmit={aramaGonder} className="pb-3 -mt-1">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <MagnifyingGlass size={16} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={sorgu}
                onChange={(e) => setSorgu(e.target.value)}
                placeholder="Haber ara..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-700 shrink-0">
                Ara
              </button>
            </div>
          </form>
        )}
      </div>

      {mobilAcik && (
        <nav className="lg:hidden border-t border-slate-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-col">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                onClick={() => setMobilAcik(false)}
                className="px-2 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 border-b border-slate-100 last:border-b-0"
              >
                {c.label}
              </Link>
            ))}
            <Link
              href="/#bulten"
              onClick={() => setMobilAcik(false)}
              className="mt-3 mb-2 text-center px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
            >
              Abone Ol
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
