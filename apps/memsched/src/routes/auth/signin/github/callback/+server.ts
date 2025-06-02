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
import type { OAuth2Tokens } from 'arctic';

import { github } from '$lib/server/oauth';
import { oauthLimiter } from '$lib/server/rate-limiter';
import { sanitizeUsername } from '$lib/server/utils';

import type { RequestEvent } from './$types';

interface IGithubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

interface IGithubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(event: RequestEvent): Promise<Response> {
  // Apply rate limiting to prevent abuse
  if (await oauthLimiter.isLimited(event)) {
    throw error(429, 'Too many requests. Please try again later.');
  }

  const storedState = event.cookies.get('github_oauth_state') ?? null;
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');

  if (storedState === null || code === null || state === null) {
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
    tokens = await github.validateAuthorizationCode(code);
  } catch (error) {
    console.error('GitHub authorization code validation error:', error);
    return new Response('Error validating authorization code. Please restart the process.', {
      status: 400,
    });
  }

  // Fetch GitHub user data
  let githubUser: IGithubUser;
  try {
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
        'User-Agent': 'memsched',
      },
    });

    if (!githubUserResponse.ok) {
      const errorText = await githubUserResponse.text();
      console.error('GitHub API error:', githubUserResponse.status, errorText);
      return new Response(`Error fetching user data: ${githubUserResponse.status}`, {
        status: 500,
      });
    }

    const responseText = await githubUserResponse.text();
    try {
      githubUser = JSON.parse(responseText) as IGithubUser;
    } catch (e) {
      console.error('Failed to parse GitHub user JSON:', e, 'Response:', responseText);
      return new Response('Invalid response from GitHub. Please try again.', {
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return new Response('Error fetching user data. Please try again.', {
      status: 500,
    });
  }

  // Fetch GitHub email data
  let emailListResult: unknown;
  try {
    const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
        'User-Agent': 'memsched',
      },
    });

    if (!githubEmailResponse.ok) {
      const errorText = await githubEmailResponse.text();
      console.error('GitHub email API error:', githubEmailResponse.status, errorText);
      return new Response(`Error fetching email data: ${githubEmailResponse.status}`, {
        status: 500,
      });
    }

    const responseText = await githubEmailResponse.text();
    try {
      emailListResult = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse GitHub emails JSON:', e, 'Response:', responseText);
      return new Response('Invalid response from GitHub. Please try again.', {
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error fetching GitHub emails:', error);
    return new Response('Error fetching email data. Please try again.', {
      status: 500,
    });
  }

  if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
    return new Response('No emails found. Please restart the process.', {
      status: 400,
    });
  }

  // Find primary and verified email
  let email: string | null = null;
  for (const emailRecord of emailListResult as IGithubUserEmail[]) {
    if (emailRecord.primary && emailRecord.verified) {
      email = emailRecord.email;
      break;
    }
  }

  if (email === null) {
    return new Response('Please verify your GitHub email address.', {
      status: 400,
    });
  }

  // Use the session service for authentication
  return await event.locals.sessionsService.handleUserAuthentication(event, {
    providerId: 'github',
    providerUserId: githubUser.id.toString(),
    email,
    username: sanitizeUsername(githubUser.login),
    name: githubUser.name || githubUser.login,
    avatarUrl: githubUser.avatar_url,
  });
}
