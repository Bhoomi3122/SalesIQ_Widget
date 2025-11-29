import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for Zoho SalesIQ operator UI (iframe-safe)
export default defineConfig({
  plugins: [react()],

  // Local dev server configuration
  server: {
    port: 5173,
    host: true,

    // Must allow embedding inside Zoho SalesIQ iframe
    headers: {
      "X-Frame-Options": "ALLOWALL", 
      "Content-Security-Policy": "frame-ancestors *", 
    },

    // If your backend runs on localhost:5000
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration for Vercel
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
