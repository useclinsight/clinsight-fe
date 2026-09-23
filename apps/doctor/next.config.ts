import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@clinsight/ui', '@clinsight/lib', '@clinsight/types'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
