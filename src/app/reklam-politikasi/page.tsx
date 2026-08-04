import type { Metadata } from "next";
import StaticSayfa from "@/components/StaticSayfa";

export const metadata: Metadata = {
  title: "Reklam ve Sponsorluk Politikası | Anchor Medya",
  description: "Anchor Medya'da reklam, sponsorlu içerik ve üçüncü taraf reklam ağlarının kullanımı hakkında bilgi.",
};

export default function ReklamPolitikasiSayfasi() {
  return (
    <StaticSayfa baslik="Reklam ve Sponsorluk Politikası" guncellemeTarihi="4 Ağustos 2026">
      <p>
        Anchor Medya, editoryal bağımsızlığını korurken sitenin sürdürülebilirliğini
        sağlamak amacıyla reklam gösterebilir. Bu sayfa, reklamların ve sponsorlu
        içeriklerin nasıl işaretlendiğini ve editoryal içerikten nasıl ayrıldığını
        açıklar.
      </p>

      <h2>Reklam Ağları</h2>
      <p>
        Sitemizde üçüncü taraf reklam ve içerik önerisi ağları (ör. Google AdSense,
        Taboola, Outbrain) aracılığıyla reklamlar ve önerilen içerik bağlantıları
        gösterilebilir. Bu ağlar, ilgi alanına dayalı reklam sunmak amacıyla çerezler
        kullanabilir; detaylar için{" "}
        <a href="/gizlilik">Gizlilik Politikamızı</a> inceleyebilirsiniz.
      </p>

      <h2>Sponsorlu İçerik</h2>
      <p>
        Herhangi bir üçüncü tarafça finanse edilen veya onunla iş birliği içinde
        hazırlanan bir içerik yayınlanırsa, bu içerik &quot;Sponsorlu&quot; veya
        &quot;Reklam&quot; etiketiyle açıkça işaretlenir ve editoryal ekibimizin
        bağımsız olarak hazırladığı haberlerden görsel olarak ayrıştırılır.
      </p>

      <h2>Editoryal Bağımsızlık</h2>
      <p>
        Reklam veya sponsorluk ilişkileri, haber içeriklerimizin editoryal kararlarını
        etkilemez. Hangi haberin yayınlanacağına, nasıl çerçeveleneceğine dair kararlar
        yalnızca editoryal ekibimiz tarafından, ticari kaygılardan bağımsız şekilde
        verilir.
      </p>

      <h2>Yatırım Tavsiyesi Değildir</h2>
      <p>
        Reklam veya sponsorlu içerikler dahil, sitemizde yer alan hiçbir içerik
        yatırım tavsiyesi niteliği taşımaz. Detaylar için{" "}
        <a href="/kullanim-kosullari">Kullanım Koşulları</a> sayfamızı inceleyebilirsiniz.
      </p>

      <h2>İletişim</h2>
      <p>
        Reklam iş birlikleri veya bu politika hakkındaki sorularınız için{" "}
        <a href="/iletisim">İletişim sayfamızı</a> kullanabilirsiniz.
      </p>

      <hr />
      <p className="text-xs text-slate-400">
        Bu metin genel bir şablon olup hukuki danışmanlık yerine geçmez. Yayına
        almadan önce bir hukuk uzmanına inceletmeniz önerilir.
      </p>
    </StaticSayfa>
  );
}
