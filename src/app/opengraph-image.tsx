import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginBottom: 20 }}>
          <span style={{ color: "#dc2626" }}>Anchor</span>
          <span style={{ color: "white" }}>Medya</span>
        </div>
        <div style={{ fontSize: 26, color: "#94a3b8" }}>
          Türkiye&apos;nin ekonomi ve finans gündemine tarafsız, bağımsız bakış
        </div>
      </div>
    ),
    { ...size }
  );
}
