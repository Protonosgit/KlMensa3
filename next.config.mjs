/** @type {import('next').NextConfig} */

const nextConfig = {
  cacheComponents: false,
  // basePath: "/",

  images: {
    remotePatterns: [
    { protocol: 'https', hostname: 'mensa-kl.de' },
    { protocol: 'https', hostname: '*.mensa-kl.de' },
    ]
  },
  async headers() {
    return [
      {
        source: "/fallback.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // For backwards compatibility
  webpack(config, { webpack }) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );
    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/] },
          use: ['@svgr/webpack'],
        },
      );
      fileLoaderRule.exclude = /\.svg$/i;
    }
    return config;
  },
  // Turbopack config
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
      '*.svg?url': {
        loaders: [],
        as: '*.svg',
      },
    },
  },
};

export default nextConfig;