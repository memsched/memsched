import type { Config } from "tailwindcss";
import sharedConfig from "@memsched/ui/tailwind";

const config: Config = {
  presets: [sharedConfig],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
};

export default config;
