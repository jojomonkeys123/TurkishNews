import type { Metadata } from "next";
import StaticSayfa from "@/components/StaticSayfa";

export const metadata: Metadata = {
  title: "Hakkımızda | Anchor Medya",
  description: "Anchor Medya kimdir, nasıl çalışır, editoryal yaklaşımı nedir?",
};

export default function HakkimizdaSayfasi() {
  return (
    <StaticSayfa baslik="Hakkımızda">
      <p>
        Anchor Medya, Türkiye&apos;nin ekonomi, finans, gündem, iş dünyası ve teknoloji
        alanlarındaki gelişmelerini takip eden dijital bir haber platformudur. Amacımız,
        okuyucularımıza güncel piyasa verilerini ve haberleri hızlı, anlaşılır ve tarafsız
        bir dille sunmaktır.
      </p>

      <h2>Editoryal Yaklaşımımız</h2>
      <p>
        Anchor Medya&apos;daki haber içerikleri, güvenilir haber ajansları ve kamuya açık
        kaynaklardan derlenen bilgiler editoryal ekibimiz tarafından özgün şekilde
        hazırlanmaktadır. Hatalı veya güncelliğini yitirmiş bir bilgi fark ederseniz{" "}
        <a href="/iletisim">bizimle iletişime geçerek</a> bildirebilirsiniz.
      </p>

      <h2>Yatırım Tavsiyesi Değildir</h2>
      <p>
        Sitemizde yer alan piyasa verileri, döviz kurları, hisse senedi ve emtia fiyatları
        yalnızca genel bilgilendirme amaçlıdır. Hiçbir içerik, herhangi bir finansal
        aracın alım satımına yönelik bir teklif, öneri veya yatırım tavsiyesi
        niteliği taşımaz. Yatırım kararlarınızı almadan önce bağımsız bir uzmana
        danışmanızı öneririz.
      </p>

      <h2>İletişim</h2>
      <p>
        Görüş, öneri ve düzeltme talepleriniz için{" "}
        <a href="/iletisim">İletişim sayfamızı</a> kullanabilirsiniz.
      </p>
    </StaticSayfa>
  );
}
