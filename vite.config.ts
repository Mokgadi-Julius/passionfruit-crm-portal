import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
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
    allowedHosts: [
      'passionfruit-crm-portal-production.up.railway.app',
      '.railway.app'
    ],
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://adequate-rejoicing-production-b4ba.up.railway.app',
        changeOrigin: true,
      }
    }
  }
})
