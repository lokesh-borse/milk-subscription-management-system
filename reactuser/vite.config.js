import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: true,
    allowedHosts: ['heymilkman.duckdns.org', 'www.heymilkman.duckdns.org', '127.0.0.1', 'localhost']
  }
})

