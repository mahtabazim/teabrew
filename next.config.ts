import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The static site shipped these paths; keep old links alive.
      { source: "/ingredients", destination: "/brew", permanent: true },
      { source: "/ingredient.html", destination: "/brew", permanent: true },
      { source: "/nearby.html", destination: "/nearby", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
