import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: '/index.html',
      },
    },
    copyPublicDir: true,
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  preview: {
    port: 8080
  },
  base: '/', // Esto es importante para el routing
})