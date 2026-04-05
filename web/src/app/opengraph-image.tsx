import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VoltStock — Hardware Premium Portugal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
        {/* Gradient accent */}
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

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Logo text */}
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

          {/* Tagline */}
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

          {/* Divider */}
          <div
            style={{
              width: "120px",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #F97316, transparent)",
              marginTop: "8px",
              marginBottom: "8px",
            }}
          />

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              fontSize: "18px",
              color: "#FED7AA",
              opacity: 0.6,
            }}
          >
            <span>Envio 24-48h</span>
            <span>•</span>
            <span>Garantia Europeia</span>
            <span>•</span>
            <span>MBWay &amp; Multibanco</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "16px",
            color: "#FED7AA",
            opacity: 0.4,
          }}
        >
          voltstock.pt — Portugal
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
