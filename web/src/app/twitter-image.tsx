import { ImageResponse } from "next/og";

export const alt = "VoltStock — Hardware Premium Portugal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0E1A 0%, #1a1f2e 50%, #0A0E1A 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #F97316, #F59E0B, #F97316)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#F97316",
              letterSpacing: "-2px",
            }}
          >
            VoltStock
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#FED7AA",
              opacity: 0.8,
            }}
          >
            Hardware Premium &amp; Eletrónica Profissional
          </div>
          <div
            style={{
              width: "120px",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #F97316, transparent)",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "40px",
              fontSize: "18px",
              color: "#FED7AA",
              opacity: 0.6,
            }}
          >
            <span>Portugal</span>
            <span>•</span>
            <span>Envio 24-48h</span>
            <span>•</span>
            <span>MBWay</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
