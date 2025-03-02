import { github } from '$lib/server/oauth';
import { createUser, getUserFromGitHubId } from '$lib/server/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import type { OAuth2Tokens } from 'arctic';
import type { RequestEvent } from './$types';

interface IGithubUser {
  id: number;
  login: string;
}

interface IGithubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(event: RequestEvent): Promise<Response> {
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
  } catch (e) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }

  const githubUserResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const githubUser: IGithubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;

  const existingUser = await getUserFromGitHubId(githubUserId);
  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/' + existingUser.username,
      },
    });
  }

  const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const emailListResult: unknown = await githubEmailResponse.json();
  if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }
  let githubEmail: string | null = null;
  for (const emailRecord of emailListResult as IGithubUserEmail[]) {
    const primaryEmail = emailRecord.primary;
    const verifiedEmail = emailRecord.verified;
    if (primaryEmail && verifiedEmail) {
      githubEmail = emailRecord.email;
    }
  }
  if (githubEmail === null) {
    return new Response('Please verify your GitHub email address.', {
      status: 400,
    });
  }

  const user = await createUser('github', githubUserId.toString(), githubEmail, githubUsername);
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/' + user.username,
    },
  });
}
