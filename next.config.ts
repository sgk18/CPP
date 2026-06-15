import type { NextConfig } from "next";

const remotePatterns: any[] = [
  {
    protocol: "https",
    hostname: "ui-avatars.com",
  },
  {
    protocol: "http",
    hostname: "ui-avatars.com",
  }
];

if (process.env.R2_PUBLIC_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
    });
  } catch (e) {
    console.error("Invalid R2_PUBLIC_URL in next.config.ts:", e);
  }
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns,
  }
};

export default nextConfig;
