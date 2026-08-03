import MarketBar from "@/components/MarketBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StaticSayfa({
  baslik,
  guncellemeTarihi,
  children,
}: {
  baslik: string;
  guncellemeTarihi?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketBar />
      <Navbar />
      <main className="max-w-[820px] mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{baslik}</h1>
        {guncellemeTarihi && (
          <p className="text-xs text-slate-400 mb-8">Son güncelleme: {guncellemeTarihi}</p>
        )}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-red-600 prose-p:text-slate-600 prose-p:leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
