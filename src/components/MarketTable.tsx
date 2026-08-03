import { TrendUp, TrendDown } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getDovizKurlari, getYahooEndeksleri } from "@/lib/market";

const currenciesYedek = [
  { name: "Dolar", code: "USD/TRY", value: "38,47", change: "+0,31%", up: true },
  { name: "Euro", code: "EUR/TRY", value: "41,82", change: "-0,08%", up: false },
  { name: "Sterlin", code: "GBP/TRY", value: "48,61", change: "+0,19%", up: true },
  { name: "Frank", code: "CHF/TRY", value: "43,29", change: "+0,44%", up: true },
  { name: "Yen", code: "JPY/TRY", value: "0,2614", change: "-0,22%", up: false },
];

const commoditiesYedek = [
  { name: "Altın (Ons)", code: "XAU/USD", value: "$3.280", change: "+0,87%", up: true },
  { name: "Gümüş (Ons)", code: "XAG/USD", value: "$32,14", change: "+1,42%", up: true },
  { name: "Brent Petrol", code: "BRENT", value: "$74,12", change: "-0,43%", up: false },
  { name: "Ham Petrol (WTI)", code: "WTI", value: "$71,88", change: "-0,51%", up: false },
];

const indicesYedek = [
  { name: "BIST 100", code: "XU100", value: "9.847,32", change: "+1,24%", up: true },
  { name: "Dow Jones", code: "DJI", value: "43.215", change: "+0,38%", up: true },
  { name: "S&P 500", code: "SPX", value: "5.932", change: "+0,51%", up: true },
  { name: "NASDAQ", code: "IXIC", value: "19.448", change: "+0,73%", up: true },
  { name: "DAX", code: "DAX", value: "23.741", change: "-0,12%", up: false },
  { name: "FTSE 100", code: "UKX", value: "8.312", change: "+0,09%", up: true },
];

type MarketRow = { name: string; code: string; value: string; change: string; up: boolean };

function TableSection({ title, data }: { title: string; data: MarketRow[] }) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        <Link href="#" className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium">
          Tümü <ArrowRight size={11} />
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-4 py-2 text-[11px] font-medium text-slate-400">İsim</th>
            <th className="text-right px-4 py-2 text-[11px] font-medium text-slate-400">Fiyat</th>
            <th className="text-right px-4 py-2 text-[11px] font-medium text-slate-400">Değ.</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
              <td className="px-4 py-2.5">
                <div className="font-medium text-sm text-slate-900">{row.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.code}</div>
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-sm font-medium text-slate-900">
                {row.value}
              </td>
              <td className="px-4 py-2.5 text-right">
                <span
                  className={`flex items-center justify-end gap-0.5 font-mono text-xs font-medium ${
                    row.up ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {row.up ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
                  {row.change}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function MarketTable() {
  const [dovizler, endeksler] = await Promise.all([getDovizKurlari(), getYahooEndeksleri()]);

  const bul = (sembol: string) => endeksler.find((e) => e.sembol === sembol);
  const endeksSatiri = (sembol: string, kod: string, yedek: MarketRow): MarketRow => {
    const e = bul(sembol);
    if (!e) return yedek;
    return {
      name: e.ad,
      code: kod,
      value: e.fiyat >= 1000 ? `$${e.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}` : `$${e.fiyat.toFixed(2)}`,
      change: `${e.degisimYuzde >= 0 ? "+" : ""}${e.degisimYuzde.toFixed(2)}%`,
      up: e.degisimYuzde >= 0,
    };
  };

  const currencies: MarketRow[] =
    dovizler.length > 0
      ? dovizler.map((d) => ({
          name: d.ad,
          code: `${d.kod}/TRY`,
          value: d.satis.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          change: currenciesYedek.find((c) => c.code === `${d.kod}/TRY`)?.change ?? "",
          up: currenciesYedek.find((c) => c.code === `${d.kod}/TRY`)?.up ?? true,
        }))
      : currenciesYedek;

  const commodities: MarketRow[] = [
    endeksSatiri("GC=F", "XAU/USD", commoditiesYedek[0]),
    endeksSatiri("SI=F", "XAG/USD", commoditiesYedek[1]),
    endeksSatiri("BZ=F", "BRENT", commoditiesYedek[2]),
    endeksSatiri("CL=F", "WTI", commoditiesYedek[3]),
  ];

  const indices: MarketRow[] = [
    (() => {
      const e = bul("^XU100");
      return e
        ? { name: e.ad, code: "XU100", value: e.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 2 }), change: `${e.degisimYuzde >= 0 ? "+" : ""}${e.degisimYuzde.toFixed(2)}%`, up: e.degisimYuzde >= 0 }
        : indicesYedek[0];
    })(),
    endeksSatiri("^DJI", "DJI", indicesYedek[1]),
    endeksSatiri("^GSPC", "SPX", indicesYedek[2]),
    endeksSatiri("^IXIC", "IXIC", indicesYedek[3]),
    endeksSatiri("^GDAXI", "DAX", indicesYedek[4]),
    endeksSatiri("^FTSE", "UKX", indicesYedek[5]),
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-red-600 rounded-full" />
        <h2 className="text-base font-bold text-slate-900">Piyasa Verileri</h2>
        <span className="text-[11px] text-slate-400 font-mono ml-1">Canlı</span>
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <TableSection title="Döviz" data={currencies} />
        </div>
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <TableSection title="Emtia" data={commodities} />
        </div>
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <TableSection title="Endeksler" data={indices} />
        </div>
      </div>
    </section>
  );
}
