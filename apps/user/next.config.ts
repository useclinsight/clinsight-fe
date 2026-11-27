import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Server action arguments may contain patient credentials.
  logging: { serverFunctions: false },
  experimental: {
    // Lab reports may be up to 10 MB; the default 1 MB action limit rejects them.
    serverActions: { bodySizeLimit: '10mb' },
  },
  transpilePackages: ['@clinsight/ui', '@clinsight/lib', '@clinsight/types'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
