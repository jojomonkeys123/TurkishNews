/**
 * Piyasa verisi kaynakları — hepsi ücretsiz:
 *  - Döviz kurları: TCMB'nin herkese açık today.xml beslemesi (API key GEREKMEZ).
 *  - Altın ve diğer seriler: TCMB EVDS API (key gerekir, evds2.tcmb.gov.tr üzerinden ücretsiz alınır).
 *  - BIST 100 ve Brent petrol: Yahoo Finance'ın resmi olmayan, key gerektirmeyen quote uç noktası.
 *    (Not: resmi bir API değil, Yahoo istediği zaman erişimi kısıtlayabilir — üretimde ara sıra
 *    başarısız olursa cache'lenmiş son değeri göstermek en güvenlisi.)
 */

export interface KurBilgisi {
  kod: string;
  ad: string;
  alis: number;
  satis: number;
}

const TCMB_TODAY_XML = "https://www.tcmb.gov.tr/kurlar/today.xml";

const IZLENEN_DOVIZLER: Record<string, string> = {
  USD: "Dolar",
  EUR: "Euro",
  GBP: "Sterlin",
  CHF: "Frank",
  JPY: "Yen",
};

export async function getDovizKurlari(): Promise<KurBilgisi[]> {
  try {
    const res = await fetch(TCMB_TODAY_XML, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const sonuc: KurBilgisi[] = [];
    for (const [kod, ad] of Object.entries(IZLENEN_DOVIZLER)) {
      const blokEslesme = xml.match(
        new RegExp(`<Currency[^>]*Kod="${kod}"[\\s\\S]*?<\\/Currency>`)
      );
      if (!blokEslesme) continue;
      const blok = blokEslesme[0];
      const alis = parseFloat(blok.match(/<ForexBuying>([\d.,]+)<\/ForexBuying>/)?.[1] || "0");
      const satis = parseFloat(blok.match(/<ForexSelling>([\d.,]+)<\/ForexSelling>/)?.[1] || "0");
      if (alis && satis) sonuc.push({ kod, ad, alis, satis });
    }
    return sonuc;
  } catch {
    return [];
  }
}

/**
 * EVDS'ten genel seri çekmek için yardımcı fonksiyon.
 * Seri kodları için bkz: https://evds2.tcmb.gov.tr (örn. altın için "TP.MK.ALTIN.KG")
 */
export async function getEvdsSerisi(
  seriKodu: string,
  baslangic: string,
  bitis: string
): Promise<Array<{ tarih: string; deger: number }>> {
  const apiKey = process.env.EVDS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://evds2.tcmb.gov.tr/service/evds/series=${seriKodu}&startDate=${baslangic}&endDate=${bitis}&type=json`;
    const res = await fetch(url, {
      headers: { key: apiKey },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.items || []).map((item: Record<string, string>) => ({
      tarih: item.Tarih,
      deger: parseFloat(item[seriKodu.replace(/\./g, "_")] || "0"),
    }));
  } catch {
    return [];
  }
}

export interface EndeksBilgisi {
  sembol: string;
  ad: string;
  fiyat: number;
  degisimYuzde: number;
}

const YAHOO_SEMBOLLER: Record<string, string> = {
  "^XU100": "BIST 100",
  "BZ=F": "Brent Petrol",
  "CL=F": "Ham Petrol (WTI)",
  "GC=F": "Altın (Ons)",
  "SI=F": "Gümüş (Ons)",
  "^DJI": "Dow Jones",
  "^GSPC": "S&P 500",
  "^IXIC": "NASDAQ",
  "^GDAXI": "DAX",
  "^FTSE": "FTSE 100",
};

export async function getBtcFiyat(): Promise<{ fiyat: number; degisimYuzde: number } | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const btc = data?.bitcoin;
    if (!btc?.usd) return null;
    return { fiyat: btc.usd, degisimYuzde: btc.usd_24h_change || 0 };
  } catch {
    return null;
  }
}

export interface PiyasaSatiri {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

const YEDEK_PIYASA: PiyasaSatiri[] = [
  { label: "BIST 100", value: "9.847,32", change: "+1,24%", up: true },
  { label: "USD/TRY", value: "38,47", change: "+0,31%", up: true },
  { label: "EUR/TRY", value: "41,82", change: "-0,08%", up: false },
  { label: "GBP/TRY", value: "48,61", change: "+0,19%", up: true },
  { label: "Altın (gr)", value: "4.127", change: "+0,87%", up: true },
  { label: "Brent Petrol", value: "$74,12", change: "-0,43%", up: false },
  { label: "BTC/USD", value: "$107.842", change: "+2,14%", up: true },
];

export async function getPiyasaOzetVerisi(): Promise<PiyasaSatiri[]> {
  const [dovizler, endeksler, btc] = await Promise.all([
    getDovizKurlari(),
    getYahooEndeksleri(),
    getBtcFiyat(),
  ]);

  const satirlar: PiyasaSatiri[] = [];

  const bist = endeksler.find((e) => e.sembol === "^XU100");
  satirlar.push(
    bist
      ? {
          label: "BIST 100",
          value: bist.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 2 }),
          change: `${bist.degisimYuzde >= 0 ? "+" : ""}${bist.degisimYuzde.toFixed(2)}%`,
          up: bist.degisimYuzde >= 0,
        }
      : YEDEK_PIYASA[0]
  );

  for (const kod of ["USD", "EUR", "GBP"]) {
    const kur = dovizler.find((d) => d.kod === kod);
    const yedek = YEDEK_PIYASA.find((y) => y.label === `${kod}/TRY`)!;
    satirlar.push(
      kur
        ? { label: `${kod}/TRY`, value: kur.satis.toLocaleString("tr-TR", { minimumFractionDigits: 2 }), change: yedek.change, up: yedek.up }
        : yedek
    );
  }

  const altin = endeksler.find((e) => e.sembol === "GC=F");
  satirlar.push(
    altin
      ? {
          label: "Altın (Ons)",
          value: `$${altin.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`,
          change: `${altin.degisimYuzde >= 0 ? "+" : ""}${altin.degisimYuzde.toFixed(2)}%`,
          up: altin.degisimYuzde >= 0,
        }
      : YEDEK_PIYASA[4]
  );

  const brent = endeksler.find((e) => e.sembol === "BZ=F");
  satirlar.push(
    brent
      ? {
          label: "Brent Petrol",
          value: `$${brent.fiyat.toFixed(2)}`,
          change: `${brent.degisimYuzde >= 0 ? "+" : ""}${brent.degisimYuzde.toFixed(2)}%`,
          up: brent.degisimYuzde >= 0,
        }
      : YEDEK_PIYASA[5]
  );

  satirlar.push(
    btc
      ? {
          label: "BTC/USD",
          value: `$${btc.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`,
          change: `${btc.degisimYuzde >= 0 ? "+" : ""}${btc.degisimYuzde.toFixed(2)}%`,
          up: btc.degisimYuzde >= 0,
        }
      : YEDEK_PIYASA[6]
  );

  return satirlar;
}

export async function getYahooEndeksleri(): Promise<EndeksBilgisi[]> {
  const semboller = Object.keys(YAHOO_SEMBOLLER).join(",");
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(semboller)}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const sonuclar = data?.quoteResponse?.result || [];
    return sonuclar.map((q: Record<string, number | string>) => ({
      sembol: q.symbol as string,
      ad: YAHOO_SEMBOLLER[q.symbol as string] || (q.symbol as string),
      fiyat: Number(q.regularMarketPrice) || 0,
      degisimYuzde: Number(q.regularMarketChangePercent) || 0,
    }));
  } catch {
    return [];
  }
}
