/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
};

export default nextConfig;
