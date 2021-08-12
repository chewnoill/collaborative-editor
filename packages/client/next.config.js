const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:6001/:path*", // Proxy to Backend
      },
      {
        source: "/ws/:path*",
        destination: "http://localhost:6001/:path*", // Proxy to Backend
      },
    ];
  },
  trailingSlash: false,
};

module.exports = nextConfig;
