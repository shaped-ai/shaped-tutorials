import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "docs.shaped.ai",
      },
    ],
  },
};

export default nextConfig;
