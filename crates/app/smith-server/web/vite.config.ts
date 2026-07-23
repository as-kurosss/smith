import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            if ((err as any)?.code === 'ECONNREFUSED') {
              try {
                (res as any)?.writeHead?.(200, { 'Content-Type': 'application/json' })
                ;(res as any)?.end?.(JSON.stringify({ success: false, error: 'Backend unavailable' }))
              } catch { /* ignore */ }
            }
          })
        },
      },
    },
  },
})
