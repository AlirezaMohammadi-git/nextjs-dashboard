import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // partial prerendering:
    ppr: "incremental"
  }
};

export default nextConfig;
