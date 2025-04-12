import * as child_process from 'node:child_process';

import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

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
        exclude: [
          '/fonts/*',
          '/icons/*',
          '/_app/immutable/*',
          '/_app/version.json',
          '/favicon.png',
          '/robots.txt',
        ],
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
        'default-src': [
          'self',
          'https://api-gateway.umami.dev/api/send',
          'https://stats.uptimerobot.com/',
        ],
        'script-src': [
          'self',
          'unsafe-inline',
          'https://cloud.umami.is/script.js',
          'https://static.cloudflareinsights.com/',
        ],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': [
          'self',
          'data:',
          'https://avatars.githubusercontent.com',
          'https://lh3.googleusercontent.com',
        ],
        'font-src': ['self'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['self', 'https://checkout.stripe.com', 'https://billing.stripe.com'],
        'frame-ancestors': ['self'],
        'upgrade-insecure-requests': process.env.CF_PAGES !== undefined,
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
