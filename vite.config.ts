import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import yaml from '@rollup/plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), yaml()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
