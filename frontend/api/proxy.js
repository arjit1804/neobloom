// api/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create proxy instance
const apiProxy = createProxyMiddleware({
  target: process.env.BACKEND_URL || 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1': '/api/v1', // No rewrite needed
  },
});

// Export the config
export default function (req, res) {
  // Don't allow proxy in development
  if (process.env.NODE_ENV === 'development') {
    return res.status(404).json({
      error: 'Proxy not available in development mode',
    });
  }

  // Forward the request to the FastAPI backend
  return apiProxy(req, res);
} 