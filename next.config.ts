import type { NextConfig } from "next";

// GitHub Pages serves static files under /<repo-name>/, so that build (and only
// that build, via GITHUB_PAGES=true) exports plain HTML with a base path.
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: !isPages,
  ...(isPages ? { experimental: { useCache: true } } : {}),
  ...(isPages
    ? {
        output: "export" as const,
        basePath: "/portfolio_website-2026",
        trailingSlash: true,
      }
    : {}),
  env: { NEXT_PUBLIC_BASE_PATH: isPages ? "/portfolio_website-2026" : "" },
  images: {
    // The image optimizer needs a server, which Pages doesn't have.
    unoptimized: isPages,
    // Covers and inline images pulled from Notion. Add a host here if a post
    // links an image from somewhere else.
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "**.notion-static.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  partialPrefetching: !isPages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
