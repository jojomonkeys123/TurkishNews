export type Kategori =
  | 'piyasalar'
  | 'ekonomi'
  | 'gundem'
  | 'is-dunyasi'
  | 'yasam'
  | 'politika'
  | 'teknoloji'
  | 'kuresel'

export interface Yazar {
  ad: string
  soyad: string
  slug: string
  unvan?: string
  uzmanlik?: string
  bio?: string
  foto?: string
  linkedin?: string
  twitter?: string
  email?: string
}

export interface Makale {
  _id: string
  baslik: string
  slug: string
  kategori: Kategori
  yazar: Yazar
  yayinTarihi: string
  kapakGorseli?: string
  ozet: string
  icerik: any[]
  etiketler?: string[]
  finansalIcerik?: boolean
  sonDakika?: boolean
  oncelik?: number
  metaBaslik?: string
  metaAciklama?: string
}

export interface KategoriBilgisi {
  slug: Kategori
  ad: string
  aciklama: string
}
