// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});