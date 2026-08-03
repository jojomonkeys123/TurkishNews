// Kategori → yazar (ad soyad) eşlemesi. seed-authors ile oluşturulan yazarlarla eşleşir.
export const KATEGORI_YAZAR = {
  ekonomi: 'Aylin Demirci',
  piyasalar: 'Kerem Yalçın',
  gundem: 'Emre Kaya',
  politika: 'Emre Kaya',
  'is-dunyasi': 'Selin Özkan',
  teknoloji: 'Barış Aydoğan',
  yasam: 'Deniz Şahin',
  kuresel: 'Mert Arslan',
}

let yazarCache = null

export async function kategoriYazariGetir(sanity, kategori) {
  if (!yazarCache) {
    const tumYazarlar = await sanity.fetch(`*[_type == "yazar"]{_id, ad, soyad}`)
    yazarCache = tumYazarlar
  }
  const adSoyad = KATEGORI_YAZAR[kategori]
  const eslesen = adSoyad
    ? yazarCache.find((y) => `${y.ad} ${y.soyad}` === adSoyad)
    : null
  if (eslesen) return eslesen._id
  if (yazarCache.length > 0) {
    return yazarCache[Math.floor(Math.random() * yazarCache.length)]._id
  }
  return null
}
