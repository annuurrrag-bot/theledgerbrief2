/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // beehiiv-hosted thumbnails and inline post images
      { protocol: 'https', hostname: 'media.beehiiv.com' },
      { protocol: 'https', hostname: '*.beehiiv.com' },
    ],
  },
};

module.exports = nextConfig;
