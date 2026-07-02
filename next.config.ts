import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy tuned for this app:
// - Next.js hydration needs inline scripts; dev also needs eval + ws (HMR)
// - inline style attributes + Google Fonts stylesheet need style-src inline + googleapis
// - images: own storage, blog cover URLs (any https), data/blob (canvas/PDF tools)
// - connect: Supabase (client NIN upload). frame: optional Google Maps embed
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://*.supabase.co${isDev ? " ws: wss:" : ""}`,
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Blog images are sent through a Server Action as base64. The default cap is
    // 1MB; raise it so larger images (esp. GIFs, which aren't compressed client
    // side) don't 413. Images are downscaled in the browser first, so this is a
    // ceiling, not the norm. (Vercel's platform request cap is ~4.5MB.)
    serverActions: { bodySizeLimit: '5mb' },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
