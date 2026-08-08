import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@digi/config",
    "@digi/types",
    "@digi/utils",
    "@digi/ui",
  ],
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "@circle-fin/developer-controlled-wallets",
  ],
};

export default nextConfig;
