import MarketBar from "@/components/MarketBar";
import Navbar from "@/components/Navbar";
import BreakingTicker from "@/components/BreakingTicker";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import MarketTable from "@/components/MarketTable";
import MoreNews from "@/components/MoreNews";
import Footer from "@/components/Footer";
import {
  getMansetMakaleler,
  getKategoriMakeleri,
  getSonMakaleler,
  getSonDakikaMakaleler,
} from "@/lib/sanity";

export default async function Home() {
  const [mansetAdaylari, ekonomiHaberleri, sonMakaleler, sonDakika] = await Promise.all([
    getMansetMakaleler(20),
    getKategoriMakeleri("ekonomi", 3),
    getSonMakaleler(6),
    getSonDakikaMakaleler(6),
  ]);

  // Görseli olan makaleler önce gelsin (öncelik sırası korunarak) — slider/sidebar'da
  // rastgele bir yedek görselle düşen eski/görselsiz makaleler olmasın.
  const gorselliOnce = [...mansetAdaylari].sort(
    (a, b) => Number(!!b.kapakGorseli) - Number(!!a.kapakGorseli)
  );
  const slaytlar = gorselliOnce.slice(0, 10);
  const digerleri = gorselliOnce.slice(10, 14);
  const baslikliste = (sonDakika.length > 0 ? sonDakika : sonMakaleler).map((m) => m.baslik);

  return (
    <>
      <MarketBar />
      <Navbar />
      <BreakingTicker baslikliste={baslikliste} />
      <HeroSection slaytlar={slaytlar} digerleri={digerleri} />
      <NewsGrid ekonomiHaberleri={ekonomiHaberleri} oneCikanlar={sonMakaleler} />
      <MarketTable />
      <MoreNews />
      <Footer />
    </>
  );
}
