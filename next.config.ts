import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Standalone output bundles only the runtime files needed at
  // production into .next/standalone — no node_modules, no devDeps,
  // no source. Used by the Dockerfile to ship a small final image.
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/webp"],
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1440, 1920],
  },
};

export default nextConfig;
