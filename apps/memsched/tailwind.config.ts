import sharedConfig from '@memsched/ui/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [sharedConfig],
  content: ['./src/**/*.{html,js,svelte,ts}', '../../packages/ui/src/**/*.{html,js,svelte,ts}'],
};

export default config;
