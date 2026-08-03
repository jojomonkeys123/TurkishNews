"use client";

import { Lightning } from "@phosphor-icons/react";

const headlines = [
  "Merkez Bankası faiz kararını açıkladı: Politika faizi yüzde 47,5'te sabit tutuldu",
  "BIST 100 endeksi güçlü başlangıcın ardından 9.847 puanı aştı",
  "Hazine 12 milyar TL iç borçlanma gerçekleştirdi",
  "Dolar kuru TCMB müdahalesinin ardından 38,47'ye geriledi",
  "IMF Türkiye büyüme tahminini yüzde 3,2'ye revize etti",
  "Enerji Bakanlığı yenilenebilir enerji kapasitesinin 2027'de 100 GW'a ulaşacağını açıkladı",
];

export default function BreakingTicker({ baslikliste }: { baslikliste?: string[] }) {
  const liste = baslikliste && baslikliste.length > 0 ? baslikliste : headlines;
  const doubled = [...liste, ...liste];

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center h-9">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-red-500 mr-3">
            <Lightning size={13} weight="fill" />
            <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
              Son Dakika
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="ticker-track flex gap-0 whitespace-nowrap">
              {doubled.map((h, i) => (
                <span key={i} className="text-xs pr-10 shrink-0">
                  {h}
                  <span className="mx-5 opacity-50">|</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
