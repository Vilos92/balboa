module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  future: {
    // Webpack will default to version 4 otherwise.
    webpack5: true
  },
  webpack(config) {
    config.resolve.fallback = {
      // Without this, all fallback options specified by next.js will be dropped.
      // This is only needed as a result of the fs: false change below.
      ...config.resolve.fallback,
      // Needed for packages such as Sendgrid to be run from the server.
      fs: false // the solution
    };

    return config;
  }
};
