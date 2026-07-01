import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/webp"],
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1440, 1920],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/_next/image/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/og/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/posts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/gemstones/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/zodiac-icons/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://adservice.google.com https://adservice.google.co.in https://*.google.com https://*.googleadservices.com https://*.google https://tpc.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.vastucart.in https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.google.com https://*.googleadservices.com https://*.google; connect-src 'self' https://api.vastucart.in https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://adservice.google.com https://adservice.google.co.in https://*.google.com https://*.googleadservices.com https://*.google https://stats.g.doubleclick.net; frame-src 'self' https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.google.com https://*.google.com https://*.google https://googleadservices.com https://*.googleadservices.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;