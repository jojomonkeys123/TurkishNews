import { TrendUp, TrendDown } from "@phosphor-icons/react/dist/ssr";
import { getPiyasaOzetVerisi } from "@/lib/market";

export default async function MarketBar() {
  const markets = await getPiyasaOzetVerisi();
  const guncelleme = new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-slate-950 text-slate-200 border-b border-slate-800">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
          {markets.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 border-r border-slate-800 shrink-0 hover:bg-slate-900 transition-colors"
            >
              <span className="text-xs text-slate-400 whitespace-nowrap">{m.label}</span>
              <span className="font-mono text-xs font-medium text-white whitespace-nowrap">
                {m.value}
              </span>
              <span
                className={`flex items-center gap-0.5 font-mono text-[11px] whitespace-nowrap ${
                  m.up ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {m.up ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
                {m.change}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-3 px-4 py-2.5 shrink-0 ml-auto">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Canlı
            </span>
            <span className="text-[11px] text-slate-500 whitespace-nowrap font-mono">
              {guncelleme}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
