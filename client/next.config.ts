import type { NextConfig } from "next";

const DEV_API_ORIGIN = "http://localhost:5000";
const PROD_API_ORIGIN = "https://linksaveweb.onrender.com";

function normalizeApiOrigin(value: string | undefined): string {
  return (value?.trim() ?? "").replace(/\/+$/, "").replace(/\/api$/, "");
}

function getApiOrigin(): string {
  const configuredOrigin =
    normalizeApiOrigin(process.env.API_URL) ||
    normalizeApiOrigin(process.env.NEXT_PUBLIC_API_URL);

  if (configuredOrigin) {
    return configuredOrigin;
  }

  return process.env.NODE_ENV === "development"
    ? DEV_API_ORIGIN
    : PROD_API_ORIGIN;
}

const apiOrigin = getApiOrigin();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
