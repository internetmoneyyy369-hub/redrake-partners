import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ["@redrake/ui", "@redrake/db", "@redrake/email"],
}

export default nextConfig
