import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push(
      'pino-pretty', 
      'lokijs', 
      'encoding',
      '@x402/evm',
      '@solana/kit',
      '@coinbase/cdp-sdk'
    );
    return config;
  },
};

export default nextConfig;