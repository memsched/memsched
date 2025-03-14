import { github } from '$lib/server/oauth';
import { createUser, getUserFromProviderUserId } from '$lib/server/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import type { OAuth2Tokens } from 'arctic';
import type { RequestEvent } from './$types';
import { getUserOverviewUrl } from '$lib/api';
import { sanitizeUsername } from '$lib/server/utils';

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

  let githubUser: IGithubUser;
  try {
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
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

  const githubUserId = githubUser.id;
  const username = sanitizeUsername(githubUser.login);
  const name = githubUser.name;
  const avatarUrl = githubUser.avatar_url;

  const existingUser = await getUserFromProviderUserId(event.locals.db, githubUserId.toString());
  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(event.locals.db, sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: getUserOverviewUrl(existingUser.username),
      },
    });
  }

  let emailListResult: unknown;
  try {
    const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
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

  let email: string | null = null;
  for (const emailRecord of emailListResult as IGithubUserEmail[]) {
    const primaryEmail = emailRecord.primary;
    const verifiedEmail = emailRecord.verified;
    if (primaryEmail && verifiedEmail) {
      email = emailRecord.email;
    }
  }
  if (email === null) {
    return new Response('Please verify your GitHub email address.', {
      status: 400,
    });
  }

  const user = await createUser(event.locals.db, 'github', githubUserId.toString(), {
    email,
    username,
    name,
    avatarUrl,
  });
  const sessionToken = generateSessionToken();
  const session = await createSession(event.locals.db, sessionToken, user.id);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: getUserOverviewUrl(user.username),
    },
  });
}
