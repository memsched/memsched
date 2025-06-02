/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { error } from '@sveltejs/kit';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';

import { google } from '$lib/server/oauth';
import { oauthLimiter } from '$lib/server/rate-limiter';
import { sanitizeUsername } from '$lib/server/utils';

import type { RequestEvent } from './$types';

interface IClaims {
  sub: string;
  name: string;
  picture: string;
  email: string;
}

export async function GET(event: RequestEvent): Promise<Response> {
  // Apply rate limiting to prevent abuse
  if (await oauthLimiter.isLimited(event)) {
    throw error(429, 'Too many requests. Please try again later.');
  }

  const storedState = event.cookies.get('google_oauth_state') ?? null;
  const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');

  if (storedState === null || codeVerifier === null || code === null || state === null) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }
  if (storedState !== state) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.error('Google authorization code validation error:', error);
    return new Response('Error validating authorization code. Please restart the process.', {
      status: 400,
    });
  }

  let claims: IClaims;
  try {
    claims = decodeIdToken(tokens.idToken()) as IClaims;
  } catch (error) {
    console.error('Error decoding Google ID token:', error);
    return new Response('Error processing authentication data. Please try again.', {
      status: 500,
    });
  }

  // Use the session service for authentication
  return await event.locals.sessionsService.handleUserAuthentication(event, {
    providerId: 'google',
    providerUserId: claims.sub,
    email: claims.email,
    username: sanitizeUsername(claims.name),
    name: claims.name,
    avatarUrl: claims.picture,
  });
}
