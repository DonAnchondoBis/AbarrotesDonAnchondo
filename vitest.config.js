import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '~/app', replacement: path.resolve(__dirname, 'src/app') },
      { find: '~/api', replacement: path.resolve(__dirname, 'src/app/api') },
      { find: '~/', replacement: path.resolve(__dirname, 'src/') },
      { find: '~/Libs', replacement: path.resolve(__dirname, 'src/Libs') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      all: true,
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      exclude: [
        'node_modules/**',
        'prisma/**',
        '**/playwright.config.js',
        '**/next.config.mjs',
        '**/tests/**',
        'vercel.json',
        'script.sh',
        'next.config.mjs',
        '.next/**',
        'vitest.config.js',
        '**/layout.jsx',
        '**/store/**',
      ],
    },
    exclude: [
      'node_modules/**',
      'prisma/**',
      '**/playwright.config.js',
      '**/next.config.mjs',
      '**/tests/**',
      'vercel.json',
      'script.sh',
      'next.config.mjs',
      '.next/**',
    ],
  },
})