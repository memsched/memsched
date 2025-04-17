// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.memsched.com',
  integrations: [tailwind(), svelte(), mdx()],
  experimental: {
    responsiveImages: true,
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: 'responsive',
  },
});
