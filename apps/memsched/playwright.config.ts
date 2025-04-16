import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm run build:e2e && pnpm run preview',
    port: 5173,
  },
  testDir: 'e2e',
});
