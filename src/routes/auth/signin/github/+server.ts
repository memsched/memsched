import { error } from '@sveltejs/kit';
import { generateState } from 'arctic';

import { github } from '$lib/server/oauth';
import { authLimiter } from '$lib/server/rate-limiter';

import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent): Promise<Response> {
  // Apply rate limiting to prevent abuse
  if (await authLimiter.isLimited(event)) {
    throw error(429, 'Too many requests. Please try again later.');
  }

  const state = generateState();
  const url = github.createAuthorizationURL(state, ['user:email']);

  event.cookies.set('github_oauth_state', state, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: '/',
    sameSite: 'lax',
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
