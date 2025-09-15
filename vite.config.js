import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  })
