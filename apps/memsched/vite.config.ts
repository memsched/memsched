import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ssr: {
    // Force these packages to be bundled (not externalized) for Cloudflare Workers
    noExternal: ['htmlparser2', 'domhandler'],
  },
  plugins: [
    enhancedImages(),
    sveltekit(),
    {
      name: 'vite-plugin-raw',
      transform(_code, id) {
        if (id.endsWith('?raw')) {
          const filePath = id.slice(0, -4);
          const fileContent = fs.readFileSync(filePath, 'base64');
          return `export default "${fileContent}"`;
        }
      },
    },
  ],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['src/setupTests.ts'],
    isolate: true,
    testTimeout: 10000,
    alias: {
      // Override @libsql/client to use node version in tests (supports :memory:)
      '@libsql/client': '@libsql/client/node',
    },
  },

  optimizeDeps: {
    exclude: ['@cf-wasm/resvg'],
  },
});
