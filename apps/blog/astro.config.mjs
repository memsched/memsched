// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://memsched.com/blog',
  base: '/blog',
  experimental: {
    responsiveImages: true,
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: 'responsive',
  },
  output: 'static',
  // trailingSlash: 'never',
  outDir: '../memsched/static/blog',
  build: {
    assetsPrefix: '/blog',
  },
  integrations: [
    tailwind(),
    svelte(),
    mdx(),
    sitemap({
      entryLimit: 50000,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
