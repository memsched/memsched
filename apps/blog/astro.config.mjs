// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.memsched.com",
  integrations: [tailwind(), svelte(), mdx()],
  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),
});
