const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = router => {
  router.use("/ws", createProxyMiddleware({
    target: "http://localhost:6001",
    changeOrigin: true,
    ws: true,
    pathRewrite: {'^/ws' : ''}
  }));
}
