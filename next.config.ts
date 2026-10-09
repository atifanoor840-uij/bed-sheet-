import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // Unsplash resizes on its CDN, so we hand it the width instead of running Next's optimizer.
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
