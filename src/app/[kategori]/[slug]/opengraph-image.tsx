import { ImageResponse } from "next/og";
import { getMakale } from "@/lib/sanity";
import { kategoriAdi } from "@/lib/kategoriler";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ kategori: string; slug: string }>;
}) {
  const { kategori, slug } = await params;
  const makale = await getMakale(kategori, slug);

  // Gerçek kapak görseli varsa onu olduğu gibi kullan.
  if (makale?.kapakGorseli) {
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={makale.kapakGorseli}
          width={size.width}
          height={size.height}
          style={{ objectFit: "cover" }}
        />
      ),
      { ...size }
    );
  }

  // Görsel yoksa (ör. veri hatası) markalı bir yedek kart üret — sosyal medya/haber
  // ağı kartlarının hiçbir zaman görselsiz/kırık görünmemesi için.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#f87171",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 16,
          }}
        >
          {makale ? kategoriAdi(makale.kategori) : "Anchor Medya"}
        </div>
        <div
          style={{
            fontSize: 52,
            color: "white",
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {makale?.baslik || "Anchor Medya"}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 32 }}>
          <span style={{ fontSize: 26, color: "#dc2626", fontWeight: 700 }}>Anchor</span>
          <span style={{ fontSize: 26, color: "white", fontWeight: 700 }}>Medya</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
