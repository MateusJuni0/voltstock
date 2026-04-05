import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0E1A 0%, #1a1520 100%)",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 900,
            background: "linear-gradient(180deg, #F97316 0%, #EA580C 100%)",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "system-ui",
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size },
  );
}
