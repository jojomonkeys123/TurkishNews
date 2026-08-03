/**
 * EkonomiHaber — Otomatik makale yayınlama scripti
 * Tamamen ücretsiz kaynaklarla çalışır: RSS (key gerekmez) + Groq API (ücretsiz) + Sanity.
 * Kullanım: node scripts/auto-publish.mjs
 * (Vercel Cron ile günde 3 kez tetiklenmesi önerilir: 08:00, 13:00, 19:00 TR saati)
 */

import { createClient } from '@sanity/client'
import Parser from 'rss-parser'

// ── Clients ──────────────────────────────────────────────────────────────────
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
const rss = new Parser({ timeout: 10000 })

const GROQ_MODEL = 'llama-3.3-70b-versatile'

async function groqChat(messages, maxTokens = 1400) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.6,
    }),
  })
  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

// ── RSS Kaynakları (Türkçe, ücretsiz — sadece doğrulanmış kategori feed'leri) ─
// Not: AA'nın "cat=" parametresi ekonomi/bilim-teknoloji/dunya/politika/guncel/yasam/saglik
// için güvenilir çalışıyor. "piyasalar" ve "is-dunyasi" için dedike bir ücretsiz feed
// olmadığından ekonomi havuzundan çekip aşağıdaki haberUygunMu() ile Groq'a
// sınıflandırtıyoruz — yanlış kategoriye yazı düşmesin diye.
// Kategori karışımı Taboola/Outbrain/MSN yayıncı ağlarının tercih ettiği çeşitliliğe göre
// seçildi: saf ekonomi/finans yerine gündem + yaşam gibi geniş ilgi alanlı kategoriler de var.
const FONTI = {
  piyasalar: ['https://www.aa.com.tr/tr/rss/default?cat=ekonomi'],
  ekonomi: ['https://www.aa.com.tr/tr/rss/default?cat=ekonomi'],
  gundem: ['https://www.aa.com.tr/tr/rss/default?cat=guncel'],
  'is-dunyasi': ['https://www.aa.com.tr/tr/rss/default?cat=ekonomi'],
  yasam: [
    'https://www.aa.com.tr/tr/rss/default?cat=yasam',
    'https://www.aa.com.tr/tr/rss/default?cat=saglik',
  ],
  politika: ['https://www.aa.com.tr/tr/rss/default?cat=politika'],
  teknoloji: ['https://www.aa.com.tr/tr/rss/default?cat=bilim-teknoloji'],
  kuresel: [
    'https://www.aa.com.tr/tr/rss/default?cat=dunya',
    'https://feeds.bbci.co.uk/news/business/rss.xml',
  ],
}

const TOPLAM = parseInt(process.env.ARTICLE_COUNT || '8')

function makalePlani(toplam) {
  if (toplam <= 3) return { ekonomi: 1, gundem: 1, yasam: 1 }
  if (toplam <= 6) return { ekonomi: 2, piyasalar: 1, gundem: 1, yasam: 1, kuresel: 1 }
  if (toplam <= 8)
    return { ekonomi: 2, piyasalar: 1, gundem: 1, 'is-dunyasi': 1, yasam: 1, teknoloji: 1, kuresel: 1 }
  return {
    ekonomi: 2,
    piyasalar: 1,
    gundem: 1,
    'is-dunyasi': 1,
    yasam: 1,
    politika: 1,
    teknoloji: 1,
    kuresel: 1,
  }
}
const PLAN = makalePlani(TOPLAM)

// ── Yardımcılar ──────────────────────────────────────────────────────────────
function slugify(text) {
  const harfler = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i' }
  return text
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (c) => harfler[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)
}

function key() {
  return Math.random().toString(36).slice(2, 10)
}

function metniBloklaraCevir(metin) {
  const lines = metin.split('\n')
  const blocks = []
  let paragraf = []

  function flush() {
    if (!paragraf.length) return
    const text = paragraf.join('\n').trim()
    if (text) {
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text, marks: [] }],
      })
    }
    paragraf = []
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush()
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'h2',
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text: line.replace(/^##\s+/, ''), marks: [] }],
      })
    } else if (line.trim() === '') {
      flush()
    } else {
      paragraf.push(line)
    }
  }
  flush()
  return blocks
}

async function slugVarMi(slug) {
  const sonuc = await sanity.fetch(`count(*[_type == "makale" && slug.current == $slug])`, { slug })
  return sonuc > 0
}

async function kategoriYazariGetir(kategori) {
  const id = await sanity.fetch(
    `*[_type == "yazar"][0]._id`
  )
  return id
}

function oncelikHesapla(baslik, ozet) {
  const metin = (baslik + ' ' + ozet).toLowerCase()
  let puan = 5
  const yuksekOncelik = ['tcmb', 'faiz kararı', 'enflasyon', 'kriz', 'iflas', 'çöküş', 'rekor']
  if (yuksekOncelik.some((k) => metin.includes(k))) puan = 8
  return puan
}

// ── RSS'ten haber çek ────────────────────────────────────────────────────────
async function haberleriCek(kategori, adet) {
  const fonti = FONTI[kategori] || []
  const items = []
  for (const url of fonti) {
    try {
      const feed = await rss.parseURL(url)
      items.push(...(feed.items || []))
    } catch {
      console.warn(`  ⚠️  RSS çekilemedi: ${url}`)
    }
  }

  const simdi = Date.now()
  const oniki_saat = simdi - 12 * 3600000

  let havuz = items.filter((i) => i.pubDate && new Date(i.pubDate).getTime() > oniki_saat)
  if (havuz.length < adet) havuz = items

  havuz.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return havuz.slice(0, adet)
}

// ── Kategori uygunluk kontrolü (Groq, ücretsiz) ──────────────────────────────
const KATEGORI_TANIMLARI = {
  piyasalar: 'borsa, hisse senedi, endeks, döviz kuru, altın, tahvil, kripto para, TCMB faiz kararı',
  ekonomi: 'enflasyon, büyüme, GSYH, işsizlik, dış ticaret, vergi, bütçe, ekonomik veri açıklaması',
  gundem: 'ulusal güncel olaylar, toplum, eğitim, adalet/yargı kararları, kaza ve afetler, yerel haberler',
  'is-dunyasi': 'şirket haberleri, holding, yatırım, birleşme-satın alma, CEO açıklaması, ihracat rakamları',
  yasam: 'sağlık, beslenme, kişisel bakım, aile, günlük yaşam pratikleri, kişisel finans tüyoları',
  politika: 'hükümet kararları, meclis, seçim, bakanlık açıklamaları, diplomasi',
  teknoloji: 'yapay zeka, yazılım, startup, teknoloji şirketleri, dijitalleşme',
  kuresel: 'küresel ekonomi, uluslararası piyasalar, Fed kararları, jeopolitik/ekonomik gelişmeler',
}

// Bu kategoriler için gündem/yaşam tarzı genel konular da kabul edilir (kısıtlama yok).
const GENEL_ILGI_KATEGORILERI = new Set(['gundem', 'yasam'])

async function haberUygunMu(baslik, ozet, kategori) {
  try {
    const kisitlama = GENEL_ILGI_KATEGORILERI.has(kategori)
      ? ''
      : '\nSpor, magazin, yargı kararları, kaza/olay haberleri gibi kategori dışı konular UYGUN DEĞİL.'

    const cevap = await groqChat(
      [
        {
          role: 'user',
          content: `Bu haber "${kategori}" kategorisine uygun mu? Kategori kapsamı: ${KATEGORI_TANIMLARI[kategori]}.${kisitlama}

Başlık: ${baslik}
Özet: ${ozet}

SADECE "EVET" ya da "HAYIR" yaz.`,
        },
      ],
      5
    )
    return cevap.trim().toUpperCase().startsWith('EVET')
  } catch {
    return true // Groq erişilemezse güvenli tarafta kal, filtrelemeden geçir
  }
}

// ── Groq ile özgün Türkçe makale yaz ─────────────────────────────────────────
async function makaleYaz(orijinalBaslik, ozetRSS, kategori) {
  const sistemMesaji = `Sen EkonomiHaber için yazan profesyonel bir muhabirsin. Tarafsız, net ve gazetecilik diliyle YALNIZCA standart Türkiye Türkçesi kullanarak yazarsın. Başka hiçbir dilden (İngilizce, Endonezce/Malayca, Vietnamca vb.) tek bir kelime bile karıştırmazsın — metnin tamamı sözlük anlamıyla doğru, temiz Türkçe olmalı. Yorum, tavsiye veya spekülasyon yapmazsın. Sağlanan bilgilerin dışına çıkmazsın.`

  const kullaniciMesaji = `KATEGORİ: ${kategori}
KAYNAK BAŞLIK: ${orijinalBaslik}
BAĞLAM: ${ozetRSS || ''}

Aşağıdaki formatta özgün bir haber makalesi yaz:

1. satır: BAŞLIK (55-90 karakter, net ve açıklayıcı, tık tuzağı değil)
[boş satır]
2. GİRİŞ paragrafı: ne oldu + nerede + ne zaman + varsa önemli rakam
[boş satır]
3-5 gövde paragrafı, gerekirse "## Alt Başlık" ile ayrılmış
Toplam 350-500 kelime, tamamen Türkçe, tarafsız ton.`

  const cevap = await groqChat([
    { role: 'system', content: sistemMesaji },
    { role: 'user', content: kullaniciMesaji },
  ])

  const satirlar = cevap.split('\n').filter((l) => l.trim())
  const baslik = satirlar[0].replace(/^#+\s*/, '').trim()
  const icerik = cevap.split('\n').slice(1).join('\n').trim()

  return { baslik, icerik }
}

// ── Görsel bulma (ücretsiz 3 katman: Unsplash → Pexels → Pixabay) ────────────
const KATEGORI_GORSEL_HAVUZU = {
  piyasalar: ['stock exchange trading floor', 'financial chart screen', 'currency exchange money'],
  ekonomi: ['economy inflation chart', 'central bank building', 'business economics data'],
  gundem: ['istanbul city street life', 'turkey national flag', 'crowd people city square'],
  'is-dunyasi': ['corporate office meeting', 'business handshake deal', 'company headquarters building'],
  yasam: ['healthy lifestyle wellness', 'family home life', 'doctor healthcare hospital'],
  politika: ['government building parliament', 'politics meeting hall', 'diplomacy summit'],
  teknoloji: ['technology startup office', 'artificial intelligence data center', 'software developer coding'],
  kuresel: ['global economy world map', 'international summit leaders', 'world trade shipping port'],
}

function turkceTemizle(metin) {
  const harfler = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'I' }
  return metin.replace(/[çğıöşüİ]/g, (c) => harfler[c] || c)
}

async function fetchUnsplash(query) {
  if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error('Unsplash key yok')
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=10`
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } })
  if (!res.ok) throw new Error(`Unsplash ${res.status}`)
  const results = (await res.json()).results || []
  if (!results.length) throw new Error('Unsplash sonuç yok')
  return results[Math.floor(Math.random() * Math.min(results.length, 5))].urls.regular
}

async function fetchPexels(query) {
  if (!process.env.PEXELS_API_KEY) throw new Error('Pexels key yok')
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
  const res = await fetch(url, { headers: { Authorization: process.env.PEXELS_API_KEY } })
  if (!res.ok) throw new Error(`Pexels ${res.status}`)
  const photos = (await res.json()).photos || []
  if (!photos.length) throw new Error('Pexels sonuç yok')
  return photos[Math.floor(Math.random() * Math.min(photos.length, 3))].src.large2x
}

async function fetchPixabay(query) {
  if (!process.env.PIXABAY_API_KEY) throw new Error('Pixabay key yok')
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&min_width=1200`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Pixabay ${res.status}`)
  const hits = (await res.json()).hits || []
  if (!hits.length) throw new Error('Pixabay sonuç yok')
  return hits[Math.floor(Math.random() * Math.min(hits.length, 3))].largeImageURL
}

async function gorselBul(kategori) {
  const havuz = KATEGORI_GORSEL_HAVUZU[kategori] || KATEGORI_GORSEL_HAVUZU.ekonomi
  const sorgu = turkceTemizle(havuz[Math.floor(Math.random() * havuz.length)])

  for (const kaynak of [fetchUnsplash, fetchPexels, fetchPixabay]) {
    try {
      return await kaynak(sorgu)
    } catch {
      // sıradaki kaynağa geç
    }
  }
  return null
}

async function gorselYukle(imageUrl, dosyaAdi) {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Görsel indirilemedi: ${res.status}`)
  const buffer = await res.arrayBuffer()
  const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
    filename: `${dosyaAdi}.jpg`,
    contentType: 'image/jpeg',
  })
  return asset._id
}

// ── Ana fonksiyon ────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.GROQ_API_KEY) {
    console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID ve GROQ_API_KEY .env.local içinde tanımlı olmalı.')
    process.exit(1)
  }

  console.log(`🚀 EkonomiHaber — ${TOPLAM} makale hedefleniyor\n`)
  let toplam = 0

  for (const [kategori, adet] of Object.entries(PLAN)) {
    console.log(`\n📰 ${kategori.toUpperCase()} (${adet} makale)`)
    const haberler = await haberleriCek(kategori, adet * 5)
    if (!haberler.length) {
      console.log('  ⚠️  Haber bulunamadı, atlanıyor')
      continue
    }

    let yazilan = 0
    for (const haber of haberler) {
      if (yazilan >= adet) break
      const orijinalBaslik = haber.title?.replace(/<[^>]+>/g, '').trim()
      if (!orijinalBaslik) continue

      if (await slugVarMi(slugify(orijinalBaslik))) {
        console.log(`  ⏭️  Zaten var: ${orijinalBaslik.slice(0, 50)}`)
        continue
      }

      const uygun = await haberUygunMu(orijinalBaslik, haber.contentSnippet || '', kategori)
      if (!uygun) {
        console.log(`  🚫  Kategori dışı, atlanıyor: ${orijinalBaslik.slice(0, 50)}`)
        continue
      }

      try {
        console.log(`  ✍️  Yazılıyor: ${orijinalBaslik.slice(0, 55)}...`)
        const { baslik, icerik } = await makaleYaz(orijinalBaslik, haber.contentSnippet || '', kategori)
        const slug = slugify(baslik)

        if (await slugVarMi(slug)) {
          console.log(`  ⏭️  Başlık zaten var: ${baslik.slice(0, 50)}`)
          continue
        }

        const ozetHam = icerik.replace(/^##.+$/gm, '').replace(/\n+/g, ' ').trim().slice(0, 200)
        const ozet = ozetHam.slice(0, ozetHam.lastIndexOf(' ')) + '…'
        const oncelik = oncelikHesapla(baslik, ozet)
        const yazarId = await kategoriYazariGetir(kategori)

        let kapakGorseli
        try {
          const gorselUrl = await gorselBul(kategori)
          if (gorselUrl) {
            console.log(`  🖼️  Görsel bulundu, yükleniyor...`)
            const assetId = await gorselYukle(gorselUrl, slug)
            kapakGorseli = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
          } else {
            console.log(`  ⚠️  Görsel bulunamadı, görselsiz devam ediliyor`)
          }
        } catch (gorselErr) {
          console.warn(`  ⚠️  Görsel yüklenemedi: ${gorselErr.message}`)
        }

        await sanity.create({
          _type: 'makale',
          baslik,
          slug: { _type: 'slug', current: slug },
          kategori,
          ...(yazarId && { yazar: { _type: 'reference', _ref: yazarId } }),
          yayinTarihi: new Date().toISOString(),
          ...(kapakGorseli && { kapakGorseli }),
          ozet,
          metaAciklama: ozet.slice(0, 160),
          icerik: metniBloklaraCevir(icerik),
          etiketler: [kategori],
          finansalIcerik: ['ekonomi', 'piyasalar'].includes(kategori),
          oncelik,
        })

        console.log(`  ✅ Kaydedildi (öncelik ${oncelik})`)
        toplam++
        yazilan++
        await new Promise((r) => setTimeout(r, 1500))
      } catch (err) {
        console.error(`  ❌ Hata: ${err.message}`)
      }
    }
  }

  console.log(`\n🎉 Tamamlandı! ${toplam} yeni makale Sanity'e eklendi.`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { main }
