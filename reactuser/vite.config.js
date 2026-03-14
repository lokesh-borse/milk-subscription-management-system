import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['heymilkman.duckdns.org', 'www.heymilkman.duckdns.org', 'localhost', '127.0.0.1']
  }
})

