import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/IP/',
  plugins: [react()],
  define: {
    // Embed the Clerk publishable key at build time so it works on GitHub Pages
    // where .env files are not available at runtime.
    'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(
      process.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_YmlnLWhlcm1pdC04MS5jbGVyay5hY2NvdW50cy5kZXYk'
    ),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
