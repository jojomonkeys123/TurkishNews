import type { Metadata } from "next";
import StaticSayfa from "@/components/StaticSayfa";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | EkonomiHaber",
  description: "EkonomiHaber web sitesi kullanım koşulları.",
};

export default function KullanimKosullariSayfasi() {
  return (
    <StaticSayfa baslik="Kullanım Koşulları" guncellemeTarihi="2 Ağustos 2026">
      <p>
        EkonomiHaber web sitesini (&quot;site&quot;) kullanarak aşağıdaki koşulları kabul
        etmiş sayılırsınız. Lütfen siteyi kullanmadan önce bu koşulları dikkatlice
        okuyun.
      </p>

      <h2>İçeriğin Kullanımı</h2>
      <p>
        Sitede yer alan haberler, veriler ve görseller yalnızca kişisel ve bilgilendirme
        amaçlı kullanım içindir. İçeriklerin ticari amaçla, kaynak belirtilmeden veya
        izinsiz şekilde çoğaltılması, dağıtılması ya da yayınlanması yasaktır.
      </p>

      <h2>Yatırım Tavsiyesi Değildir</h2>
      <p>
        Sitede yayınlanan piyasa verileri, döviz kurları, hisse senedi, altın ve emtia
        fiyatları ile ekonomi haberleri yalnızca genel bilgilendirme amaçlıdır ve
        yatırım tavsiyesi niteliği taşımaz. Bu bilgilere dayanarak alınan yatırım
        kararlarından EkonomiHaber sorumlu tutulamaz.
      </p>

      <h2>İçeriklerin Doğruluğu</h2>
      <p>
        Haberlerimiz güvenilir kaynaklardan derlenerek özgün şekilde hazırlanmaktadır.
        Ancak piyasa verilerindeki gecikmeler, üçüncü taraf veri sağlayıcılardan
        kaynaklanan hatalar veya güncellik farkları olabilir. Kritik kararlar için
        verileri resmi kaynaklardan teyit etmenizi öneririz.
      </p>

      <h2>Sorumluluk Sınırlaması</h2>
      <p>
        EkonomiHaber, sitenin kesintisiz veya hatasız çalışacağını garanti etmez.
        Sitenin kullanımından doğabilecek doğrudan veya dolaylı zararlardan
        EkonomiHaber sorumlu tutulamaz.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu kullanım koşulları önceden haber verilmeksizin güncellenebilir. Güncel
        koşullar bu sayfada yayınlanır.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için <a href="/iletisim">İletişim sayfamızı</a> kullanabilirsiniz.
      </p>

      <hr />
      <p className="text-xs text-slate-400">
        Bu metin genel bir şablon olup hukuki danışmanlık yerine geçmez. Yayına
        almadan önce bir hukuk uzmanına inceletmeniz önerilir.
      </p>
    </StaticSayfa>
  );
}
