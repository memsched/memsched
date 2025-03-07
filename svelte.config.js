import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import * as child_process from 'node:child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
      platformProxy: {
        configPath: 'wrangler.jsonc',
        environment: undefined,
        experimentalJsonConfig: false,
        persist: false,
      },
    }),
    // CSP Configuration
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': [
          'self',
          'https://avatars.githubusercontent.com',
          'https://lh3.googleusercontent.com',
        ],
        'font-src': ['self'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['self'],
        'frame-ancestors': ['none'],
        // TODO: Remove this comment in prod
        // 'upgrade-insecure-requests': true,
        'block-all-mixed-content': true,
      },
      // reportOnly: {
      //   'report-uri': ['/api/csp-report'],
      //   'report-to': ['csp-endpoint'],
      // },
    },
    // CSRF Protection
    csrf: {
      checkOrigin: true,
    },
    // Version management for safer deployments
    version: {
      name: child_process.execSync('git rev-parse HEAD').toString().trim(),
      pollInterval: 60000, // Check for new versions every minute
    },
  },
};

export default config;
