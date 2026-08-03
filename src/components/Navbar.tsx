import Link from "next/link";
import { MagnifyingGlass, BellRinging, List } from "@phosphor-icons/react/dist/ssr";

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
            <button className="btn-icon p-2 text-slate-500 hover:text-slate-900 rounded">
              <MagnifyingGlass size={18} />
            </button>
            <button className="btn-icon p-2 text-slate-500 hover:text-slate-900 rounded">
              <BellRinging size={18} />
            </button>
            <button className="btn-subscribe hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded">
              Abone Ol
            </button>
            <button className="btn-icon lg:hidden p-2 text-slate-500 hover:text-slate-900">
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
