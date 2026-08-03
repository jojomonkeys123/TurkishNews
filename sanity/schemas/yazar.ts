import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'yazar',
  title: 'Yazar',
  type: 'document',
  fields: [
    defineField({
      name: 'ad',
      title: 'Ad',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'soyad',
      title: 'Soyad',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: (doc: any) => `${doc.ad}-${doc.soyad}` },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'unvan',
      title: 'Unvan',
      type: 'string',
      description: 'Örn: Ekonomi Muhabiri, Finans Analisti, Dış Haberler Editörü',
    }),
    defineField({
      name: 'uzmanlik',
      title: 'Uzmanlık Alanı',
      type: 'string',
      description: 'Örn: Para Politikası, Piyasalar, Enerji',
    }),
    defineField({
      name: 'bio',
      title: 'Biyografi',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'foto',
      title: 'Fotoğraf',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'twitter', title: 'X (Twitter) URL', type: 'url' }),
    defineField({ name: 'email', title: 'İletişim E-postası', type: 'string' }),
  ],
  preview: {
    select: { title: 'ad', subtitle: 'soyad', media: 'foto' },
    prepare({ title, subtitle, media }: any) {
      return { title: `${title} ${subtitle}`, media }
    },
  },
})
