import { defineField, defineType } from 'sanity'

const KATEGORILER = ['piyasalar', 'ekonomi', 'gundem', 'is-dunyasi', 'yasam', 'politika', 'teknoloji', 'kuresel']
const KATEGORI_ETIKETLERI: Record<string, string> = {
  piyasalar: 'Piyasalar',
  ekonomi: 'Ekonomi',
  gundem: 'Gündem',
  'is-dunyasi': 'İş Dünyası',
  yasam: 'Yaşam',
  politika: 'Politika',
  teknoloji: 'Teknoloji',
  kuresel: 'Küresel',
}

export default defineType({
  name: 'makale',
  title: 'Makale',
  type: 'document',
  fields: [
    defineField({
      name: 'baslik',
      title: 'Başlık',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'baslik', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: KATEGORILER.map((k) => ({ title: KATEGORI_ETIKETLERI[k], value: k })),
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'yazar',
      title: 'Yazar',
      type: 'reference',
      to: [{ type: 'yazar' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'yayinTarihi',
      title: 'Yayın Tarihi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kapakGorseli',
      title: 'Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternatif Metin', type: 'string' }),
        defineField({ name: 'caption', title: 'Açıklama', type: 'string' }),
      ],
    }),
    defineField({
      name: 'ozet',
      title: 'Özet',
      type: 'text',
      rows: 3,
      description: 'Kart/önizlemede gösterilen kısa açıklama (maks. 200 karakter).',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'icerik',
      title: 'İçerik',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alternatif Metin', type: 'string' }),
            defineField({ name: 'caption', title: 'Açıklama', type: 'string' }),
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'etiketler',
      title: 'Etiketler',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'oncelik',
      title: 'Öncelik (1-10)',
      type: 'number',
      description: '10 = manşet, 7+ = önemli, altı = normal. Sıralamayı belirler.',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'finansalIcerik',
      title: 'Finansal içerik mi?',
      type: 'boolean',
      description: 'Makale sonunda "yatırım tavsiyesi değildir" uyarısı gösterir (SPK mevzuatı gereği).',
      initialValue: false,
    }),
    defineField({
      name: 'sonDakika',
      title: 'Son dakika mı?',
      type: 'boolean',
      description: 'Üst şeritte (breaking ticker) gösterilir.',
      initialValue: false,
    }),
    defineField({
      name: 'metaBaslik',
      title: 'Meta Başlık (SEO)',
      type: 'string',
      description: 'Boş bırakılırsa ana başlık kullanılır. Maks. 60 karakter.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaAciklama',
      title: 'Meta Açıklama (SEO)',
      type: 'text',
      rows: 2,
      description: 'Maks. 160 karakter.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: { title: 'baslik', subtitle: 'kategori', media: 'kapakGorseli' },
    prepare({ title, subtitle, media }: any) {
      return { title, subtitle: subtitle ? KATEGORI_ETIKETLERI[subtitle] ?? subtitle : '', media }
    },
  },
  orderings: [
    {
      title: 'Yayın tarihi (en yeni)',
      name: 'yayinTarihiDesc',
      by: [{ field: 'yayinTarihi', direction: 'desc' }],
    },
  ],
})
