/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'js.stripe.com',
      },
      {
        protocol: 'https',
        hostname: '*.stripe.com',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
