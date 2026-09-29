import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly. An unrelated stray lockfile at
  // /home/admin1/package-lock.json was making Next.js infer the workspace
  // root as the whole home directory instead of this project folder,
  // which made the dev server trace/watch far more of the filesystem
  // than it needed to (contributing to the dev-server memory blowups).
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.clarity.ms; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.google-analytics.com *.supabase.co *.clarity.ms; style-src 'self' 'unsafe-inline'; frame-ancestors 'self';" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // non-www → www (301 permanent — tells Google which is canonical)
      {
        source: "/:path*",
        has: [{ type: "host", value: "gardeningisezee.com" }],
        destination: "https://www.gardeningisezee.com/:path*",
        permanent: true,
      },
      { source: "/author", destination: "/about", permanent: true },
      // Routes inherited from the template that this site does not use.
      { source: "/categories/:slug", destination: "/:slug", permanent: false },
      { source: "/categories", destination: "/", permanent: false },
      { source: "/compare/:path*", destination: "/", permanent: false },
      { source: "/deals", destination: "/", permanent: false },
      { source: "/reviews/:path*", destination: "/", permanent: false },
    ];
  },
  experimental: {
    // Keep local production builds within the 14 GiB workstation's memory
    // budget. This project prerenders 1600+ pages, and the default worker
    // count caused several concurrent Node processes to exhaust RAM + swap.
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Type-checking already runs locally (`npx tsc --noEmit`) before every push per the
  // pre-commit gate. With 1600+ static guide pages, Next's in-build tsc pass was taking
  // long enough to hit the Vercel Hobby plan's ~45min build timeout, causing build errors
  // and backing up the deploy queue. Skip the redundant in-build check.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;
