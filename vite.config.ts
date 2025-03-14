import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['src/setupTests.ts'],
    isolate: true,
    testTimeout: 10000,
  },
});
