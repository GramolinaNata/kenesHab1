
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',  // Важно для Docker
    port: 3000,
    strictPort: true,  // Не менять порт если 3000 занят
  },
  preview: {
    host: '0.0.0.0',  // Для production билда
    port: 3000,
    strictPort: true,
  }
  
})