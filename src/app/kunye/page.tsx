import type { Metadata } from "next";
import Link from "next/link";
import StaticSayfa from "@/components/StaticSayfa";

export const metadata: Metadata = {
  title: "Künye | Anchor Medya",
  description: "Anchor Medya yayın sorumlusu, editoryal ekip ve iletişim bilgileri.",
};

const editorler = [
  { alan: "Ekonomi", ad: "Aylin Demirci" },
  { alan: "Piyasalar", ad: "Kerem Yalçın" },
  { alan: "Gündem & Politika", ad: "Emre Kaya" },
  { alan: "İş Dünyası", ad: "Selin Özkan" },
  { alan: "Teknoloji", ad: "Barış Aydoğan" },
  { alan: "Yaşam", ad: "Deniz Şahin" },
  { alan: "Küresel", ad: "Mert Arslan" },
];

export default function KunyeSayfasi() {
  return (
    <StaticSayfa baslik="Künye" guncellemeTarihi="4 Ağustos 2026">
      <h2>Yayın Sorumlusu</h2>
      <p>Zafer Altuntaş</p>

      <h2>Editoryal Ekip</h2>
      <ul>
        {editorler.map((e) => (
          <li key={e.alan}>
            <strong>{e.alan}:</strong> {e.ad}
          </li>
        ))}
      </ul>

      <h2>Adres</h2>
      <p>Küçükçekmece, İstanbul, Türkiye</p>

      <h2>İletişim</h2>
      <p>
        E-posta:{" "}
        <a href="mailto:anchormedyailetisim@gmail.com">anchormedyailetisim@gmail.com</a>
        <br />
        Diğer talepleriniz için <Link href="/iletisim">İletişim sayfamızı</Link> da
        kullanabilirsiniz.
      </p>

      <h2>Yayın Bilgileri</h2>
      <ul>
        <li>Yayın türü: Dijital haber yayını</li>
        <li>Yayın dili: Türkçe</li>
        <li>Yayın sıklığı: Sürekli güncelleme</li>
        <li>Kuruluş yılı: 2026</li>
      </ul>

      <hr />
      <p className="text-xs text-slate-400">
        Anchor Medya, bağımsız bir dijital yayıncılık girişimidir.
      </p>
    </StaticSayfa>
  );
}
