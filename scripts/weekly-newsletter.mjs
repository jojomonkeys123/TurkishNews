/**
 * Anchor Medya — Haftalık bülten scripti
 * Her Pazartesi 09:00'da çalışır, geçen haftanın öne çıkan haberlerini Resend üzerinden gönderir.
 * Kullanım: node scripts/weekly-newsletter.mjs
 * Gerekli: Resend hesabında bir Audience (Kitle) oluşturup RESEND_AUDIENCE_ID'yi .env.local'e ekle.
 */

import { createClient } from '@sanity/client'
import { Resend } from 'resend'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ''
const FROM = process.env.RESEND_FROM || 'Anchor Medya <bulten@anchormedya.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const KATEGORI_ETIKET = {
  piyasalar: 'Piyasalar',
  ekonomi: 'Ekonomi',
  gundem: 'Gündem',
  'is-dunyasi': 'İş Dünyası',
  yasam: 'Yaşam',
  politika: 'Politika',
  teknoloji: 'Teknoloji',
  kuresel: 'Küresel',
}

function gecenHaftaAraligi() {
  const simdi = new Date()
  const baslangic = new Date(simdi)
  baslangic.setDate(baslangic.getDate() - 7)
  return { baslangic: baslangic.toISOString(), bitis: simdi.toISOString() }
}

async function haftaninMakaleleriniGetir() {
  const { baslangic, bitis } = gecenHaftaAraligi()
  return sanity.fetch(
    `*[_type == "makale" && yayinTarihi >= $baslangic && yayinTarihi <= $bitis]
     | order(coalesce(oncelik, 5) desc, yayinTarihi desc) [0...20] {
      baslik,
      slug,
      kategori,
      yayinTarihi,
      ozet,
      "kapakGorseli": kapakGorseli.asset->url
    }`,
    { baslangic, bitis }
  )
}

function kategoriyeGoreGrupla(makaleler) {
  const gruplar = {}
  for (const m of makaleler) {
    if (!gruplar[m.kategori]) gruplar[m.kategori] = []
    if (gruplar[m.kategori].length < 3) gruplar[m.kategori].push(m)
  }
  return gruplar
}

function emailHtmlOlustur(makaleler, gruplar) {
  const ilk5 = makaleler.slice(0, 5)
  const haftaStr = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })

  const oneCikanlarHtml = ilk5
    .map(
      (m) => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${
              m.kapakGorseli
                ? `<td width="120" style="padding-right: 16px; vertical-align: top;">
              <img src="${m.kapakGorseli}" width="120" height="80" style="border-radius: 8px; object-fit: cover; display: block;" />
            </td>`
                : ''
            }
            <td style="vertical-align: top;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #dc2626; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                ${KATEGORI_ETIKET[m.kategori] || m.kategori}
              </p>
              <a href="${SITE_URL}/${m.kategori}/${m.slug.current}" style="font-size: 16px; font-weight: 700; color: #111; text-decoration: none; line-height: 1.4; display: block; margin-bottom: 6px;">
                ${m.baslik}
              </a>
              <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">
                ${m.ozet || ''}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join('')

  const kategoriSatirlariHtml = Object.entries(gruplar)
    .map(
      ([kat, ms]) => `
    <tr>
      <td style="padding: 0 0 28px 0;">
        <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">
          ${KATEGORI_ETIKET[kat] || kat}
        </p>
        ${ms
          .map(
            (m) => `
          <p style="margin: 0 0 8px 0;">
            <a href="${SITE_URL}/${m.kategori}/${m.slug.current}" style="font-size: 14px; color: #111; text-decoration: none; font-weight: 600;">
              → ${m.baslik}
            </a>
          </p>
        `
          )
          .join('')}
      </td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anchor Medya — Haftalık Bülten</title>
</head>
<body style="margin: 0; padding: 0; background: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f4; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <tr>
            <td style="background: #0f172a; padding: 28px 32px; border-radius: 12px 12px 0 0; text-align: center;">
              <p style="margin: 0; font-size: 32px; font-weight: 900; color: white; letter-spacing: -1px;">
                <span style="color:#ef4444;">Anchor</span>Medya
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 2px;">Haftalık Bülten · ${haftaStr}</p>
              <div style="margin-top: 12px; display: inline-block;">
                <div style="width: 32px; height: 3px; background: #dc2626; border-radius: 2px; display: inline-block;"></div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background: white; padding: 32px;">

              <p style="margin: 0 0 24px 0; font-size: 15px; color: #444; line-height: 1.6;">
                Merhaba! Bu geçen hafta <strong>Anchor Medya</strong>'da öne çıkan haberler.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 13px; font-weight: 800; color: #111; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 3px solid #111; padding-bottom: 10px;">
                📰 Bu Haftanın Öne Çıkanları
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${oneCikanlarHtml}
              </table>

              <p style="margin: 8px 0 20px 0; font-size: 13px; font-weight: 800; color: #111; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 3px solid #111; padding-bottom: 10px;">
                📂 Kategorilere Göre
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${kategoriSatirlariHtml}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0 8px 0;">
                    <a href="${SITE_URL}" style="display: inline-block; background: #dc2626; color: white; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                      Anchor Medya'da Devamını Oku →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background: #f8f8f8; padding: 20px 32px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
                Bu e-postayı anchormedya.com üzerinden bültene abone olduğunuz için alıyorsunuz.<br>
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #999;">Abonelikten çık</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

async function main() {
  console.log('📧 Haftalık bülten başlıyor...')

  if (!AUDIENCE_ID) {
    console.error('❌ RESEND_AUDIENCE_ID eksik — Resend panelinden bir Audience oluşturup ID\'sini .env.local\'e ekle.')
    process.exit(1)
  }

  const makaleler = await haftaninMakaleleriniGetir()
  if (makaleler.length === 0) {
    console.log('⚠️  Bu haftaya ait makale bulunamadı, gönderim iptal.')
    return
  }

  console.log(`✅ ${makaleler.length} makale bulundu`)

  const gruplar = kategoriyeGoreGrupla(makaleler)
  const html = emailHtmlOlustur(makaleler, gruplar)
  const haftaStr = new Date().toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })

  const { data: broadcast, error: bcError } = await resend.broadcasts.create({
    audienceId: AUDIENCE_ID,
    from: FROM,
    subject: `📰 Anchor Medya — ${haftaStr} Haftası Öne Çıkanlar`,
    html,
  })

  if (bcError) {
    console.error('❌ Broadcast oluşturulamadı:', bcError)
    process.exit(1)
  }

  console.log(`✅ Broadcast oluşturuldu: ${broadcast.id}`)

  const { error: sendError } = await resend.broadcasts.send(broadcast.id)
  if (sendError) {
    console.error('❌ Gönderim hatası:', sendError)
    process.exit(1)
  }

  console.log('🎉 Haftalık bülten gönderildi!')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { main }
