import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'ekonomi-haber',
  title: 'Anchor Medya CMS',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('İçerik')
          .items([
            S.listItem()
              .title('Makaleler')
              .child(
                S.documentList()
                  .title('Tüm Makaleler')
                  .filter('_type == "makale"')
              ),
            S.divider(),
            S.listItem()
              .title('Yazarlar')
              .child(
                S.documentList()
                  .title('Yazarlar')
                  .filter('_type == "yazar"')
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
