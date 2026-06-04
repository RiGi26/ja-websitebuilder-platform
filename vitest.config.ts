import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// F5-4 — test suite render. Lingkungan node (renderToStaticMarkup, tanpa jsdom).
// JSX automatic supaya komponen .tsx bisa di-render di test tanpa next.
export default defineConfig({
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
