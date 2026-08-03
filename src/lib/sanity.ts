import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import type { Makale } from '@/types'
import { cache } from 'react'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const configured = Boolean(projectId)

export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = createImageUrlBuilder({ projectId: projectId || 'placeholder', dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}, fallback?: T): Promise<T> {
  if (!configured) return (fallback ?? []) as T
  try {
    return await sanityClient.fetch<T>(query, params)
  } catch {
    return (fallback ?? []) as T
  }
}

const MAKALE_ALANLARI = `
  _id,
  baslik,
  "slug": slug.current,
  kategori,
  yazar->{ad, soyad, "slug": slug.current},
  yayinTarihi,
  "kapakGorseli": kapakGorseli.asset->url,
  ozet,
  finansalIcerik,
  sonDakika,
  oncelik
`

export const getMansetMakaleler = cache(async (limit = 5): Promise<Makale[]> => {
  return safeFetch(
    `*[_type == "makale"] | order(coalesce(oncelik, 5) desc, yayinTarihi desc) [0...$limit] {${MAKALE_ALANLARI}}`,
    { limit: limit - 1 }
  )
})

export const getSonMakaleler = cache(async (limit = 20): Promise<Makale[]> => {
  return safeFetch(
    `*[_type == "makale"] | order(yayinTarihi desc) [0...$limit] {${MAKALE_ALANLARI}}`,
    { limit: limit - 1 }
  )
})

export const getSonDakikaMakaleler = cache(async (limit = 10): Promise<Makale[]> => {
  return safeFetch(
    `*[_type == "makale" && sonDakika == true] | order(yayinTarihi desc) [0...$limit] {${MAKALE_ALANLARI}}`,
    { limit: limit - 1 }
  )
})

export const getKategoriMakeleri = cache(
  async (kategori: string, limit = 20): Promise<Makale[]> => {
    return safeFetch(
      `*[_type == "makale" && kategori == $kategori] | order(yayinTarihi desc) [0...$limit] {${MAKALE_ALANLARI}}`,
      { kategori, limit: limit - 1 }
    )
  }
)

export async function getKategoriMakeleriSayfa(
  kategori: string,
  page: number,
  pageSize: number
): Promise<Makale[]> {
  const offset = (page - 1) * pageSize
  const end = offset + pageSize - 1
  return safeFetch(
    `*[_type == "makale" && kategori == $kategori] | order(yayinTarihi desc) [$offset..$end] {${MAKALE_ALANLARI}}`,
    { kategori, offset, end }
  )
}

export async function countKategoriMakeleri(kategori: string): Promise<number> {
  return safeFetch<number>(`count(*[_type == "makale" && kategori == $kategori])`, { kategori }, 0)
}

export const getMakale = cache(
  async (kategori: string, slug: string): Promise<Makale | null> => {
    return safeFetch(
      `*[_type == "makale" && kategori == $kategori && slug.current == $slug][0] {
        _id, baslik, "slug": slug.current, kategori,
        yazar->{ad, soyad, "slug": slug.current, bio, "foto": foto.asset->url},
        yayinTarihi,
        "kapakGorseli": kapakGorseli.asset->url,
        ozet,
        icerik[]{
          ...,
          _type == "image" => { ..., "url": asset->url }
        },
        etiketler, finansalIcerik, sonDakika,
        metaBaslik, metaAciklama
      }`,
      { kategori, slug },
      null
    )
  }
)

export const getTumSlug = cache(async (): Promise<Array<{ kategori: string; slug: string }>> => {
  return safeFetch(`*[_type == "makale"] { kategori, "slug": slug.current }`)
})

export const getIlgiliMakeleler = cache(
  async (kategori: string, mevcutSlug: string, limit = 4): Promise<Makale[]> => {
    return safeFetch(
      `*[_type == "makale" && kategori == $kategori && slug.current != $mevcutSlug] | order(yayinTarihi desc) [0...$limit] {${MAKALE_ALANLARI}}`,
      { kategori, mevcutSlug, limit: limit - 1 }
    )
  }
)

export const aramaYap = cache(async (query: string, limit = 30): Promise<Makale[]> => {
  const q = query.trim()
  if (!q) return []

  const words = q
    .toLowerCase()
    .replace(/[''`]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9çğıöşü]/g, ''))
    .filter((w) => w.length >= 3)
    .slice(0, 6)

  if (!words.length) return []

  const conditions = words.map((_, i) => `baslik match $w${i} || ozet match $w${i}`).join(' || ')
  const params: Record<string, unknown> = { limit: limit - 1 }
  words.forEach((w, i) => {
    params[`w${i}`] = `${w}*`
  })

  return safeFetch(
    `*[_type == "makale" && (${conditions})] | order(coalesce(oncelik,5) desc, yayinTarihi desc) [0...$limit] {${MAKALE_ALANLARI}}`,
    params
  )
})

export const isSanityConfigured = configured
