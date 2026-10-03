/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The app is published as a GitHub Pages project site, so every asset
// must resolve under /grab-your-popcorn/ (dev, preview and production).
export const BASE = '/grab-your-popcorn/'

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss()],
  server: { port: 5180, strictPort: true },
  preview: { port: 4173, strictPort: true },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
  },
})
