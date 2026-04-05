import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VoltStock - Hardware Premium Portugal",
    short_name: "VoltStock",
    description:
      "A referencia em hardware premium e eletronica profissional em Portugal.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#F97316",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
