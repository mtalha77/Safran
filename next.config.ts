import type { NextConfig } from "next";
import path from "node:path";

function supabaseImageHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseImageHost();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow up to ~5 MB image uploads (+ multipart overhead).
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  turbopack: {
    root: path.join(__dirname),
  },
  // The bill PDF reads the handwriting font from disk at request time, which
  // file tracing cannot infer on its own.
  outputFileTracingIncludes: {
    "/*": ["src/backend/printing/fonts/**"],
  },
};

export default nextConfig;
