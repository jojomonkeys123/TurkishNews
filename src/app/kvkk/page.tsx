import type { Metadata } from "next";
import StaticSayfa from "@/components/StaticSayfa";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | EkonomiHaber",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

export default function KvkkSayfasi() {
  return (
    <StaticSayfa baslik="KVKK Aydınlatma Metni" guncellemeTarihi="2 Ağustos 2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, veri
        sorumlusu sıfatıyla EkonomiHaber olarak, kişisel verilerinizin işlenmesine
        ilişkin sizleri bilgilendirmek isteriz.
      </p>

      <h2>İşlenen Kişisel Veriler</h2>
      <p>
        Siteyi ziyaret ettiğinizde veya bültenimize/iletişim formumuza kayıt
        olduğunuzda; ad-soyad, e-posta adresi ve site kullanım verileriniz (IP adresi,
        tarayıcı bilgisi, ziyaret edilen sayfalar) işlenebilir.
      </p>

      <h2>İşleme Amaçları</h2>
      <ul>
        <li>Haber bülteni göndermek</li>
        <li>İletişim formu üzerinden gelen talepleri yanıtlamak</li>
        <li>Site kullanımını analiz etmek ve hizmet kalitesini artırmak</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>Hukuki Sebep</h2>
      <p>
        Kişisel verileriniz, KVKK&apos;nın 5. maddesinde belirtilen &quot;ilgili kişinin
        açık rızası&quot; ve &quot;veri sorumlusunun meşru menfaati&quot; hukuki
        sebeplerine dayanılarak işlenmektedir.
      </p>

      <h2>Verilerin Aktarılması</h2>
      <p>
        Kişisel verileriniz, hizmet aldığımız yurt içi/yurt dışı barındırma, e-posta ve
        analitik hizmet sağlayıcılarına, yalnızca hizmetin ifası amacıyla ve KVKK&apos;ya
        uygun şekilde aktarılabilir.
      </p>

      <h2>Haklarınız (KVKK m. 11)</h2>
      <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Silinmesini veya yok edilmesini isteme</li>
        <li>İşlemeye itiraz etme</li>
      </ul>
      <p>
        Bu haklarınızı kullanmak için <a href="/iletisim">İletişim sayfamız</a>{" "}
        üzerinden bize ulaşabilirsiniz.
      </p>

      <hr />
      <p className="text-xs text-slate-400">
        Bu metin genel bir şablon olup hukuki danışmanlık yerine geçmez. KVKK
        uyumluluğu bağlayıcı yasal yükümlülükler içerdiğinden, yayına almadan önce
        mutlaka bir hukuk uzmanına inceletmeniz önerilir.
      </p>
    </StaticSayfa>
  );
}
