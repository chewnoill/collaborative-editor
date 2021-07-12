const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = router => {
  router.use("/api", createProxyMiddleware({
    target: "http://localhost:6001",
    changeOrigin: true,
    pathRewrite: {'^/api' : ''}
  }));
  router.use("/ws", createProxyMiddleware({
    target: "http://localhost:6001",
    changeOrigin: true,
    ws: true,
    pathRewrite: {'^/ws' : ''}
  }));
}
