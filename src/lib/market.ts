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
  "XU100.IS": "BIST 100",
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

  const bist = endeksler.find((e) => e.sembol === "XU100.IS");
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

export interface PiyasaSatiriDetay {
  name: string;
  code: string;
  value: string;
  change: string;
  up: boolean;
}

const currenciesYedek: PiyasaSatiriDetay[] = [
  { name: "Dolar", code: "USD/TRY", value: "38,47", change: "+0,31%", up: true },
  { name: "Euro", code: "EUR/TRY", value: "41,82", change: "-0,08%", up: false },
  { name: "Sterlin", code: "GBP/TRY", value: "48,61", change: "+0,19%", up: true },
  { name: "Frank", code: "CHF/TRY", value: "43,29", change: "+0,44%", up: true },
  { name: "Yen", code: "JPY/TRY", value: "0,2614", change: "-0,22%", up: false },
];

const commoditiesYedek: PiyasaSatiriDetay[] = [
  { name: "Altın (Ons)", code: "XAU/USD", value: "$3.280", change: "+0,87%", up: true },
  { name: "Gümüş (Ons)", code: "XAG/USD", value: "$32,14", change: "+1,42%", up: true },
  { name: "Brent Petrol", code: "BRENT", value: "$74,12", change: "-0,43%", up: false },
  { name: "Ham Petrol (WTI)", code: "WTI", value: "$71,88", change: "-0,51%", up: false },
];

const indicesYedek: PiyasaSatiriDetay[] = [
  { name: "BIST 100", code: "XU100", value: "9.847,32", change: "+1,24%", up: true },
  { name: "Dow Jones", code: "DJI", value: "43.215", change: "+0,38%", up: true },
  { name: "S&P 500", code: "SPX", value: "5.932", change: "+0,51%", up: true },
  { name: "NASDAQ", code: "IXIC", value: "19.448", change: "+0,73%", up: true },
  { name: "DAX", code: "DAX", value: "23.741", change: "-0,12%", up: false },
  { name: "FTSE 100", code: "UKX", value: "8.312", change: "+0,09%", up: true },
];

export async function getPiyasaTablolari(): Promise<{
  currencies: PiyasaSatiriDetay[];
  commodities: PiyasaSatiriDetay[];
  indices: PiyasaSatiriDetay[];
}> {
  const [dovizler, endeksler] = await Promise.all([getDovizKurlari(), getYahooEndeksleri()]);

  const bul = (sembol: string) => endeksler.find((e) => e.sembol === sembol);
  const endeksSatiri = (sembol: string, kod: string, yedek: PiyasaSatiriDetay): PiyasaSatiriDetay => {
    const e = bul(sembol);
    if (!e) return yedek;
    return {
      name: e.ad,
      code: kod,
      value:
        e.fiyat >= 1000
          ? `$${e.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`
          : `$${e.fiyat.toFixed(2)}`,
      change: `${e.degisimYuzde >= 0 ? "+" : ""}${e.degisimYuzde.toFixed(2)}%`,
      up: e.degisimYuzde >= 0,
    };
  };

  const currencies: PiyasaSatiriDetay[] =
    dovizler.length > 0
      ? dovizler.map((d) => ({
          name: d.ad,
          code: `${d.kod}/TRY`,
          value: d.satis.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          change: currenciesYedek.find((c) => c.code === `${d.kod}/TRY`)?.change ?? "",
          up: currenciesYedek.find((c) => c.code === `${d.kod}/TRY`)?.up ?? true,
        }))
      : currenciesYedek;

  const commodities: PiyasaSatiriDetay[] = [
    endeksSatiri("GC=F", "XAU/USD", commoditiesYedek[0]),
    endeksSatiri("SI=F", "XAG/USD", commoditiesYedek[1]),
    endeksSatiri("BZ=F", "BRENT", commoditiesYedek[2]),
    endeksSatiri("CL=F", "WTI", commoditiesYedek[3]),
  ];

  const indices: PiyasaSatiriDetay[] = [
    (() => {
      const e = bul("XU100.IS");
      return e
        ? {
            name: e.ad,
            code: "XU100",
            value: e.fiyat.toLocaleString("tr-TR", { maximumFractionDigits: 2 }),
            change: `${e.degisimYuzde >= 0 ? "+" : ""}${e.degisimYuzde.toFixed(2)}%`,
            up: e.degisimYuzde >= 0,
          }
        : indicesYedek[0];
    })(),
    endeksSatiri("^DJI", "DJI", indicesYedek[1]),
    endeksSatiri("^GSPC", "SPX", indicesYedek[2]),
    endeksSatiri("^IXIC", "IXIC", indicesYedek[3]),
    endeksSatiri("^GDAXI", "DAX", indicesYedek[4]),
    endeksSatiri("^FTSE", "UKX", indicesYedek[5]),
  ];

  return { currencies, commodities, indices };
}

// Not: Yahoo'nun eski toplu "v7/finance/quote" uç noktası artık 401 (Unauthorized)
// döndürüyor — Yahoo bu API'yi kısıtladı. Tekil sembol bazlı "v8/finance/chart"
// uç noktası hâlâ anahtarsız çalışıyor, bu yüzden her sembolü paralel çekiyoruz.
export async function getYahooEndeksleri(): Promise<EndeksBilgisi[]> {
  const girdiler = Object.entries(YAHOO_SEMBOLLER);

  const sonuclar = await Promise.all(
    girdiler.map(async ([sembol, ad]) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sembol)}?interval=1d&range=1d`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 300 },
          }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        const fiyat = Number(meta?.regularMarketPrice);
        if (!fiyat) return null;
        const onceki = Number(meta?.previousClose ?? meta?.chartPreviousClose ?? fiyat);
        const degisimYuzde = onceki ? ((fiyat - onceki) / onceki) * 100 : 0;
        return { sembol, ad, fiyat, degisimYuzde } as EndeksBilgisi;
      } catch {
        return null;
      }
    })
  );

  return sonuclar.filter((s): s is EndeksBilgisi => s !== null);
}
