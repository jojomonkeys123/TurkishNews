/**
 * Anchor Medya — Saatlik son dakika taraması
 * RSS (ücretsiz) → Groq önem skoru (ücretsiz) → sadece 7+ puan alanlar "sonDakika" olarak yayınlanır.
 * Kullanım: node scripts/breaking-news.mjs
 * (Vercel Cron ile saatte bir tetiklenmesi önerilir.)
 */

import { createClient } from '@sanity/client'
import Parser from 'rss-parser'
import { kategoriYazariGetir } from './lib/yazar-esleme.mjs'

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
    body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: maxTokens, temperature: 0.5 }),
  })
  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

// ── Geniş haber havuzu (tüm kategoriler, tek seferde tara) ───────────────────
const TARAMA_KAYNAKLARI = [
  'https://www.aa.com.tr/tr/rss/default?cat=guncel',
  'https://www.aa.com.tr/tr/rss/default?cat=ekonomi',
  'https://www.aa.com.tr/tr/rss/default?cat=dunya',
  'https://feeds.bbci.co.uk/news/business/rss.xml',
]

const GECERLI_KATEGORILER = ['piyasalar', 'ekonomi', 'gundem', 'is-dunyasi', 'yasam', 'politika', 'teknoloji', 'kuresel']

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
  return metin
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: 'block',
      _key: key(),
      style: p.startsWith('## ') ? 'h2' : 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: key(), text: p.replace(/^##\s+/, ''), marks: [] }],
    }))
}

async function haberleriTara() {
  const items = []
  for (const url of TARAMA_KAYNAKLARI) {
    try {
      const feed = await rss.parseURL(url)
      items.push(...(feed.items || []))
    } catch {
      console.warn(`  ⚠️  RSS çekilemedi: ${url}`)
    }
  }
  const iki_saat = Date.now() - 2 * 3600000
  return items.filter((i) => i.title && (!i.pubDate || new Date(i.pubDate).getTime() > iki_saat))
}

// ── Groq ile önem skoru + kategori + özgün Türkçe makale (tek çağrıda) ───────
async function skorlaVeYaz(orijinalBaslik, ozet) {
  const cevap = await groqChat([
    {
      role: 'system',
      content:
        'YALNIZCA standart Türkiye Türkçesi kullanırsın. Başka hiçbir dilden (İngilizce, Çince, Endonezce/Malayca vb.) tek bir kelime veya karakter bile karıştırmazsın.',
    },
    {
      role: 'user',
      content: `Sen Anchor Medya'da çalışan bir editörsün. Bu haberi değerlendir ve gerekiyorsa makaleye dönüştür.

KAYNAK BAŞLIK: ${orijinalBaslik}
BAĞLAM: ${ozet || ''}

TAM OLARAK bu formatta cevap ver:
PUAN: [1-10 arası tam sayı]
KATEGORI: [${GECERLI_KATEGORILER.join('|')}]
BASLIK: [Türkçe, 55-90 karakter, çarpıcı ama tık tuzağı değil]
---
[Türkçe tam makale, en az 300 kelime, gerekirse "## Alt Başlık" ile bölümlenmiş, tarafsız gazetecilik dili]

PUANLAMA REHBERİ:
9-10 = Savaş, terör saldırısı, piyasa çöküşü (%5+), doğal afet, TCMB acil faiz kararı
7-8 = Önemli faiz/politika kararı, kritik seçim sonucu, diplomatik kriz, piyasa hareketi (%2+)
5-6 = Önemli ama acil olmayan haber
1-4 = Sıradan haber, yayınlanmaz

Sadece istenen formatta cevap ver, başka hiçbir şey ekleme.`,
    },
  ])

  const satirlar = cevap.split('\n')
  const puanIdx = satirlar.findIndex((l) => l.startsWith('PUAN:'))
  const katIdx = satirlar.findIndex((l) => l.startsWith('KATEGORI:'))
  const baslikIdx = satirlar.findIndex((l) => l.startsWith('BASLIK:'))
  const ayracIdx = satirlar.findIndex((l) => l.trim().startsWith('---'))

  const puan = parseInt(satirlar[puanIdx]?.replace('PUAN:', '').trim() || '0', 10)
  let kategori = satirlar[katIdx]?.replace('KATEGORI:', '').trim() || 'gundem'
  if (!GECERLI_KATEGORILER.includes(kategori)) kategori = 'gundem'
  const baslik = satirlar[baslikIdx]?.replace('BASLIK:', '').trim() || orijinalBaslik

  // İçerik, başlık satırlarının SONRASINDAN başlar. "---" ayracı bazen modelin
  // çıktısında eksik gelebiliyor — bu yüzden en son bulunan başlık satırının
  // indeksine güveniyoruz, sadece "---" varsa onu atlıyoruz.
  const sonBaslikIdx = Math.max(puanIdx, katIdx, baslikIdx)
  const icerikBaslangic = ayracIdx > sonBaslikIdx ? ayracIdx + 1 : sonBaslikIdx + 1
  const icerik = satirlar
    .slice(icerikBaslangic)
    .filter((l) => !/^(PUAN|KATEGORI|BASLIK):/.test(l.trim()))
    .join('\n')
    .trim()

  return { puan, kategori, baslik, icerik }
}

// ── Görsel (ücretsiz 3 katman, auto-publish.mjs ile aynı mantık) ─────────────
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
  return photos[0].src.large2x
}

async function fetchPixabay(query) {
  if (!process.env.PIXABAY_API_KEY) throw new Error('Pixabay key yok')
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&min_width=1200`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Pixabay ${res.status}`)
  const hits = (await res.json()).hits || []
  if (!hits.length) throw new Error('Pixabay sonuç yok')
  return hits[0].largeImageURL
}

async function gorselBulVeYukle(baslik, dosyaAdi) {
  const sorgu = baslik
    .split(/\s+/)
    .filter((w) => w.length > 5)
    .slice(0, 3)
    .join(' ') || 'türkiye haber'

  for (const kaynak of [fetchUnsplash, fetchPexels, fetchPixabay]) {
    try {
      const url = await kaynak(sorgu)
      const res = await fetch(url)
      const buffer = await res.arrayBuffer()
      const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
        filename: `${dosyaAdi}.jpg`,
        contentType: 'image/jpeg',
      })
      return asset._id
    } catch {
      // sıradaki kaynağa geç
    }
  }
  return null
}

async function slugVarMi(slug) {
  return (await sanity.fetch(`count(*[_type == "makale" && slug.current == $slug])`, { slug })) > 0
}

// ── Ana fonksiyon ─────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.GROQ_API_KEY) {
    console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID ve GROQ_API_KEY .env.local içinde tanımlı olmalı.')
    process.exit(1)
  }

  console.log('⚡ Son dakika taraması başlıyor...\n')
  const haberler = await haberleriTara()
  console.log(`${haberler.length} güncel haber bulundu, önem skoru hesaplanıyor...\n`)

  let yayinlanan = 0

  for (const haber of haberler.slice(0, 20)) {
    const orijinalBaslik = haber.title?.replace(/<[^>]+>/g, '').trim()
    if (!orijinalBaslik) continue

    if (await slugVarMi(slugify(orijinalBaslik))) continue

    let degerlendirme
    try {
      degerlendirme = await skorlaVeYaz(orijinalBaslik, haber.contentSnippet || '')
    } catch (err) {
      console.warn(`  ⚠️  Değerlendirme hatası: ${err.message}`)
      continue
    }

    const { puan, kategori, baslik, icerik } = degerlendirme
    if (puan < 7) {
      console.log(`  ⬇️  ${puan}/10 — atlanıyor: ${orijinalBaslik.slice(0, 50)}`)
      continue
    }

    const slug = slugify(baslik)
    if (await slugVarMi(slug)) continue

    console.log(`  🔴 ${puan}/10 — SON DAKİKA: ${baslik.slice(0, 60)}`)

    const yazarId = await kategoriYazariGetir(sanity, kategori)
    const assetId = await gorselBulVeYukle(baslik, slug)
    const ozetHam = icerik.replace(/^##.+$/gm, '').replace(/\n+/g, ' ').trim().slice(0, 200)
    const ozet = ozetHam.slice(0, ozetHam.lastIndexOf(' ')) + '…'

    try {
      await sanity.create({
        _type: 'makale',
        baslik,
        slug: { _type: 'slug', current: slug },
        kategori,
        ...(yazarId && { yazar: { _type: 'reference', _ref: yazarId } }),
        yayinTarihi: new Date().toISOString(),
        ...(assetId && { kapakGorseli: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } }),
        ozet,
        metaAciklama: ozet.slice(0, 160),
        icerik: metniBloklaraCevir(icerik),
        etiketler: [kategori, 'son-dakika'],
        finansalIcerik: ['ekonomi', 'piyasalar'].includes(kategori),
        sonDakika: true,
        oncelik: puan,
      })
      yayinlanan++
    } catch (err) {
      console.error(`  ❌ Kaydetme hatası: ${err.message}`)
    }

    await new Promise((r) => setTimeout(r, 1500))
  }

  console.log(`\n✅ ${yayinlanan} son dakika haberi yayınlandı (puan 7+).`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { main }
