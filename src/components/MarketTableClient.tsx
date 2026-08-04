"use client";

import { useEffect, useState } from "react";
import { TrendUp, TrendDown, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import type { PiyasaSatiriDetay } from "@/lib/market";

const YENILEME_MS = 45000;

type Tablolar = {
  currencies: PiyasaSatiriDetay[];
  commodities: PiyasaSatiriDetay[];
  indices: PiyasaSatiriDetay[];
};

function TableSection({ title, data }: { title: string; data: PiyasaSatiriDetay[] }) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        <Link href="/piyasalar" className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium">
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

export default function MarketTableClient({ initial }: { initial: Tablolar }) {
  const [tablolar, setTablolar] = useState(initial);

  useEffect(() => {
    let iptal = false;

    async function yenile() {
      try {
        const res = await fetch("/api/piyasa", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!iptal && data.currencies) {
          setTablolar({
            currencies: data.currencies,
            commodities: data.commodities,
            indices: data.indices,
          });
        }
      } catch {
        // sessizce geç
      }
    }

    const zamanlayici = setInterval(yenile, YENILEME_MS);
    return () => {
      iptal = true;
      clearInterval(zamanlayici);
    };
  }, []);

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
          <TableSection title="Döviz" data={tablolar.currencies} />
        </div>
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <TableSection title="Emtia" data={tablolar.commodities} />
        </div>
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <TableSection title="Endeksler" data={tablolar.indices} />
        </div>
      </div>
    </section>
  );
}
