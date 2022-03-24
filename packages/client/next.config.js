const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "http://localhost:8080/api/:path*", // Proxy to Backend
      },
      {
        source: "/ws/:path*/",
        destination: "http://localhost:8080/ws/:path*", // Proxy to Backend
      },
    ];
  },
  trailingSlash: true,
};

module.exports = nextConfig;
