import { error } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

import { google } from '$lib/server/oauth';
import { authLimiter } from '$lib/server/rate-limiter';

import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent): Promise<Response> {
  // Apply rate limiting to prevent abuse
  if (await authLimiter.isLimited(event)) {
    throw error(429, 'Too many requests. Please try again later.');
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);

  event.cookies.set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
  event.cookies.set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
