import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

function patternFromEnvUrl(envUrl: string | undefined) {
  if (!envUrl) return null;
  try {
    const url = new URL(envUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return null;
  }
}

const envPatterns = [
  patternFromEnvUrl(process.env.NEXT_PUBLIC_API_URL),
  patternFromEnvUrl(process.env.NEXT_PUBLIC_R2_URL),
].filter((pattern): pattern is { protocol: "http" | "https"; hostname: string } => pattern !== null);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...envPatterns,
      // Cloudflare R2 buckets (custom + default dev domains)
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      // Google OAuth profile pictures
      { protocol: "https", hostname: "*.googleusercontent.com" },
      // Placeholder images (seed/dev data)
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
