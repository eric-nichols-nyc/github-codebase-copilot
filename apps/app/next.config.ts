import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@neondatabase/auth",
    "@repo/design-system",
    "@repo/observability",
  ],
  serverExternalPackages: ["@neondatabase/serverless"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
