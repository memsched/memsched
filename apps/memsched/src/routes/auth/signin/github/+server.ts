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
