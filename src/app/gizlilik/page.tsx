import type { Metadata } from "next";
import StaticSayfa from "@/components/StaticSayfa";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Anchor Medya",
  description: "Anchor Medya gizlilik politikası ve çerez kullanımı hakkında bilgi.",
};

export default function GizlilikSayfasi() {
  return (
    <StaticSayfa baslik="Gizlilik Politikası" guncellemeTarihi="2 Ağustos 2026">
      <p>
        Anchor Medya (&quot;biz&quot;, &quot;site&quot;) olarak kullanıcılarımızın
        gizliliğine önem veriyoruz. Bu politika, sitemizi ziyaret ettiğinizde hangi
        verilerin toplandığını, nasıl kullanıldığını ve haklarınızın neler olduğunu
        açıklar.
      </p>

      <h2>Topladığımız Veriler</h2>
      <ul>
        <li>
          <strong>Kullanım verileri:</strong> Sayfa görüntülemeleri, tıklamalar ve site
          içi gezinme verileri, hizmeti iyileştirmek amacıyla analitik araçlarla
          toplanabilir.
        </li>
        <li>
          <strong>E-posta bülten aboneliği:</strong> Bültenimize abone olduğunuzda
          e-posta adresiniz, yalnızca bülten göndermek amacıyla saklanır.
        </li>
        <li>
          <strong>İletişim formu:</strong> İletişim formunu kullandığınızda ad, e-posta
          ve mesaj içeriğiniz, yalnızca talebinize yanıt vermek amacıyla işlenir.
        </li>
        <li>
          <strong>Çerezler (cookies):</strong> Site deneyimini iyileştirmek ve reklam
          ağlarının (ör. Google AdSense, Taboola, Outbrain) ilgi alanına dayalı reklam
          göstermesini sağlamak amacıyla çerezler kullanılabilir.
        </li>
      </ul>

      <h2>Üçüncü Taraf Hizmetler</h2>
      <p>
        Sitemizin çalışması için içerik yönetimi (Sanity), e-posta gönderimi (Resend)
        ve reklam/analitik hizmetleri gibi üçüncü taraf altyapı sağlayıcıları
        kullanılmaktadır. Bu sağlayıcılar, kendi gizlilik politikaları çerçevesinde
        veri işler.
      </p>

      <h2>Haklarınız</h2>
      <p>
        Kişisel verilerinize erişme, düzeltme, silme veya işlenmesine itiraz etme
        hakkına sahipsiniz. Taleplerinizi{" "}
        <a href="/iletisim">İletişim sayfamız</a> üzerinden iletebilirsiniz. KVKK
        kapsamındaki haklarınız için <a href="/kvkk">KVKK Aydınlatma Metni</a>&apos;ni
        inceleyebilirsiniz.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir. Önemli değişiklikler bu sayfada
        yayınlanır.
      </p>

      <hr />
      <p className="text-xs text-slate-400">
        Bu metin genel bir şablon olup hukuki danışmanlık yerine geçmez. Yayına
        almadan önce bir hukuk uzmanına inceletmeniz önerilir.
      </p>
    </StaticSayfa>
  );
}
