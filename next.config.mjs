/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'www.mensa-kl.de',
            port: '',
            pathname: '/mimg/**',
          },
        ],
      },
};

export default nextConfig;
