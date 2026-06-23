import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Change the proxy target below if your Spring Boot backend runs on a different port
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/accounts': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Uncomment below to see proxy requests in terminal:
        // configure: (proxy) => { proxy.on('proxyReq', (_, req) => console.log('→', req.url)); },
      },
    },
  },
});
