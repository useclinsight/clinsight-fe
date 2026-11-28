import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Server action arguments may contain patient credentials.
  logging: { serverFunctions: false },
  experimental: {
    // Allow multipart overhead around a 10 MB report.
    proxyClientMaxBodySize: '11mb',
    serverActions: { bodySizeLimit: '11mb' },
  },
  transpilePackages: ['@clinsight/ui', '@clinsight/lib', '@clinsight/types'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
