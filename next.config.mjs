/** @type {import('next').NextConfig} */

import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  //reactStrictMode: true,
  cacheComponents: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mensa-kl.de" },
      { protocol: "https", hostname: "*.mensa-kl.de" },
    ],
  },

  // SVG handling (Webpack fallback)
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: {
            not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/],
          },
          use: ["@svgr/webpack"],
        },
      );

      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },

  // Turbopack config
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.svg?url": {
        loaders: [],
        as: "*.svg",
      },
    },
  },
};

export default withPWA(nextConfig);
