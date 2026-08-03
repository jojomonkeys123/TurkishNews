// Başlıktan görsel arama terimi çıkarma + kategori bazlı yedek havuz.
// auto-publish.mjs ve breaking-news.mjs tarafından ortak kullanılır.

export const ANAHTAR_SOZLUK = [
  [/tcmb|merkez bankas/i, 'central bank building'],
  [/faiz/i, 'interest rate finance'],
  [/enflasyon/i, 'inflation economy chart'],
  [/altın/i, 'gold bars'],
  [/dolar|döviz|kur/i, 'dollar currency exchange'],
  [/\beuro\b/i, 'euro currency'],
  [/borsa|bist|hisse/i, 'stock exchange trading floor'],
  [/petrol|brent/i, 'oil rig petroleum industry'],
  [/yapay zeka/i, 'artificial intelligence technology'],
  [/teknoloji|yazılım|startup|girişim/i, 'technology startup office'],
  [/otomobil|araç|araba/i, 'automobile car factory'],
  [/ihracat|gümrük|ticaret/i, 'cargo shipping export port'],
  [/enerji|elektrik/i, 'energy power plant'],
  [/tarım|çiftçi/i, 'agriculture farm field'],
  [/sağlık|hastane/i, 'hospital healthcare medical'],
  [/eğitim|okul|üniversite/i, 'school education classroom'],
  [/spor|futbol|basketbol/i, 'stadium sports arena'],
  [/seçim|oy\b/i, 'election voting ballot'],
  [/asker|savunma|ordu/i, 'military defense'],
  [/deprem|afet|sel\b/i, 'earthquake disaster response'],
  [/turizm|tatil/i, 'tourism travel destination'],
  [/emlak|konut|kira/i, 'real estate housing'],
  [/kripto|bitcoin/i, 'cryptocurrency bitcoin'],
  [/gazze|israil|filistin/i, 'middle east conflict news'],
  [/rusya|ukrayna/i, 'eastern europe geopolitics'],
]

export function baslikAnahtarKelime(baslik) {
  for (const [regex, terim] of ANAHTAR_SOZLUK) {
    if (regex.test(baslik)) return terim
  }
  return null
}

export const KATEGORI_GORSEL_HAVUZU = {
  piyasalar: ['stock exchange trading floor', 'financial chart screen', 'currency exchange money'],
  ekonomi: ['economy inflation chart', 'central bank building', 'business economics data'],
  gundem: ['istanbul city street life', 'turkey national flag', 'crowd people city square'],
  'is-dunyasi': ['corporate office meeting', 'business handshake deal', 'company headquarters building'],
  yasam: ['healthy lifestyle wellness', 'family home life', 'doctor healthcare hospital'],
  politika: ['government building parliament', 'politics meeting hall', 'diplomacy summit'],
  teknoloji: ['technology startup office', 'artificial intelligence data center', 'software developer coding'],
  kuresel: ['global economy world map', 'international summit leaders', 'world trade shipping port'],
}

export function gorselSorgulariOlustur(kategori, baslik) {
  const havuz = KATEGORI_GORSEL_HAVUZU[kategori] || KATEGORI_GORSEL_HAVUZU.ekonomi
  const anahtar = baslik ? baslikAnahtarKelime(baslik) : null
  return [anahtar, havuz[Math.floor(Math.random() * havuz.length)], havuz[Math.floor(Math.random() * havuz.length)]].filter(
    Boolean
  )
}

export function gorselId(url) {
  return url.split('?')[0]
}
