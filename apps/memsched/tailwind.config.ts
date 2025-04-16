import type { Config } from 'tailwindcss';
import sharedConfig from '@memsched/ui/tailwind';

const config: Config = {
  presets: [sharedConfig],
  content: ['./src/**/*.{html,js,svelte,ts}', '../../packages/ui/src/**/*.{html,js,svelte,ts}'],
};

export default config;
