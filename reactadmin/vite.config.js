import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: true,
    allowedHosts: ['heymilkmanadmin.duckdns.org', 'www.heymilkmanadmin.duckdns.org', '127.0.0.1', 'localhost']
  }
})
