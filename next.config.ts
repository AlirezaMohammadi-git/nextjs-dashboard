import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // partial prerendering:
    ppr: "incremental"
  }
};

module.exports = {
  images: {
    remotePatterns: [new URL("https://avatars.githubusercontent.com/u/75356563?v=4")],
  },
}

export default nextConfig;
