const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/img/:path*/",
        destination: "http://service:8080/img/:path*", // Proxy to Backend
      },
      {
        source: "/api/:path*/",
        destination: "http://service:8080/api/:path*", // Proxy to Backend
      },
    ];
  },
  trailingSlash: true,
};

module.exports = nextConfig;
