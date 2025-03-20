const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

app.use(
  "/api/huggingface",
  createProxyMiddleware({
    target: "https://router.huggingface.co",
    changeOrigin: true,
    pathRewrite: { "^/api/huggingface": "" },
    timeout: 1000000,
    proxyTimeout: 1000000,
    onProxyRes: (proxyRes) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(504).json({ error: "Gateway timeout or API error" });
    },
  })
);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
