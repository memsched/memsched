import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // Only allow access in development mode
  if (!dev) {
    throw redirect(307, '/');
  }
};
