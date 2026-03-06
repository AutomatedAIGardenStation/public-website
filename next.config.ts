import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",     // static HTML export for GitHub Pages
  trailingSlash: true,  // ensures paths resolve correctly on Pages
  images: {
    unoptimized: true,  // next/image optimisation not available in static export
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.performance = {
        ...config.performance,
        hints: "warning",
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }
    return config;
  },
  // Ensure that next dev/build works out of the box with the custom webpack config in nextjs16+
  turbopack: {},
};

export default nextConfig;
