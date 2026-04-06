import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Image stocks
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.pexels.com" },
      // Marketplaces
      { protocol: "https", hostname: "ae01.alicdn.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.aliexpress.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      // Manufacturer CDNs
      { protocol: "https", hostname: "asset.msi.com" },
      { protocol: "https", hostname: "dlcdnwebimgs.asus.com" },
      { protocol: "https", hostname: "assets.corsair.com" },
      { protocol: "https", hostname: "assets.micron.com" },
      { protocol: "https", hostname: "images.samsung.com" },
      { protocol: "https", hostname: "images.teamgroupinc.com" },
      { protocol: "https", hostname: "images.hermanmiller.group" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "image.benq.com" },
      { protocol: "https", hostname: "img.noblechairs.com" },
      { protocol: "https", hostname: "resource.logitech.com" },
      { protocol: "https", hostname: "resource.logitechg.com" },
      { protocol: "https", hostname: "medias-p1.phoenix.razer.com" },
      { protocol: "https", hostname: "assets2.razerzone.com" },
      { protocol: "https", hostname: "nex-img.dxracer.cc" },
      { protocol: "https", hostname: "cdn.autonomous.ai" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "hyperx.com" },
      { protocol: "https", hostname: "row.hyperx.com" },
      { protocol: "https", hostname: "cougargaming.com" },
      { protocol: "https", hostname: "nzxt.com" },
      { protocol: "https", hostname: "www.lg.com" },
      { protocol: "https", hostname: "www.razer.com" },
      { protocol: "https", hostname: "www.andaseat.com" },
      // Newegg CDN
      { protocol: "https", hostname: "c1.neweggimages.com" },
      // Additional manufacturer CDNs
      { protocol: "https", hostname: "www.bequiet.com" },
      { protocol: "https", hostname: "cdn.deepcool.com" },
      { protocol: "https", hostname: "lian-li.com" },
      { protocol: "https", hostname: "www.gskill.com" },
      { protocol: "https", hostname: "images.evga.com" },
      { protocol: "https", hostname: "www.nvidia.com" },
      { protocol: "https", hostname: "semiconductor.samsung.com" },
      { protocol: "https", hostname: "images.steelcase.com" },
      { protocol: "https", hostname: "secretlab.co" },
      { protocol: "https", hostname: "www.ikea.com" },
      // SFF cases
      { protocol: "https", hostname: "ssupd.co" },
      // Wildcard patterns
      { protocol: "https", hostname: "**.neweggimages.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' http://72.60.88.137:8000 https://*.supabase.co https://api.stripe.com",
              "frame-src https://js.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
};

export default nextConfig;
