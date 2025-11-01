import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/weather': {
        target: 'https://api.weatherapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, '/v1'),
      },
    },
  },
})