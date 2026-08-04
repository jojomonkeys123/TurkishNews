import type { Metadata } from "next";
import StaticSayfa from "@/components/StaticSayfa";
import IletisimForm from "@/components/IletisimForm";

export const metadata: Metadata = {
  title: "İletişim | Anchor Medya",
  description: "Anchor Medya ile iletişime geçin.",
};

export default function IletisimSayfasi() {
  return (
    <StaticSayfa baslik="İletişim">
      <p>
        Görüş, öneri, düzeltme talebi veya iş birliği teklifleriniz için aşağıdaki formu
        kullanabilir ya da doğrudan{" "}
        <a href="mailto:anchormedyailetisim@gmail.com">anchormedyailetisim@gmail.com</a> adresine
        yazabilirsiniz.
      </p>
      <div className="not-prose mt-6 max-w-[480px]">
        <IletisimForm />
      </div>
    </StaticSayfa>
  );
}
