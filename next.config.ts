import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Without this, multi-page static export writes flat files (privacy.html)
  // while next/link's client-side router requests routes with a trailing
  // slash (/privacy/) for their RSC payload - a request that resolves to an
  // empty directory with no index.html on a plain static host, silently
  // breaking navigation. trailingSlash makes every route consistently
  // <route>/index.html, which is what static hosts (Cloudflare Pages
  // included) expect by default.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
