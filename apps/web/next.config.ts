import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@digi/config",
    "@digi/types",
    "@digi/utils",
    "@digi/ui",
  ],
};

export default nextConfig;
