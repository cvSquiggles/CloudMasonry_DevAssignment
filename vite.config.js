import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { //Proxy added to prevent CORS errors accessing API from localhost
    proxy: {
      '/nasa-api': {
        target: 'https://images-api.nasa.gov',
        changeOrigin: true,
        rewrite: (path => path.replace(/^\/nasa-api/, ''))
      }
    }
  }
})
