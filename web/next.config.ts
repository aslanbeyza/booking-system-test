import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Turbopack kökü için denemeler bazı monorepo düzenlerinde build kırabiliyor;
   * API HTML dönüşü: lib/parse-api-response.ts + web/.env.local (NEXT_PUBLIC_API_URL) */
};

export default nextConfig;
