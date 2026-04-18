import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://adequate-rejoicing-production-b4ba.up.railway.app',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://adequate-rejoicing-production-b4ba.up.railway.app',
        changeOrigin: true,
      }
    }
  }
})
