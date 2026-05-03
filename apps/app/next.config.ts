import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/design-system", "@repo/observability"],
  serverExternalPackages: ["@neondatabase/serverless"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
