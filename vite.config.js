import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
      },
    },
    copyPublicDir: true, // Esto asegura que los archivos de public se copien
  }
})