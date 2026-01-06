import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Force html-dom-parser to use server version (htmlparser2) instead of
      // browser version which requires DOM APIs not available in Cloudflare Workers
      'html-dom-parser': 'html-dom-parser/lib/server/html-to-dom',
    },
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
  },

  optimizeDeps: {
    exclude: ['@cf-wasm/resvg'],
  },
});
