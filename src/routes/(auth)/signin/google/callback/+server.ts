import { google } from '$lib/server/oauth';
import { createUser, getUserFromProviderUserId } from '$lib/server/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import type { RequestEvent } from './$types';
import { getUserOverviewUrl } from '$lib/api';
import { sanitizeUsername } from '$lib/server/utils';

interface IClaims {
  sub: string;
  name: string;
  picture: string;
  email: string;
}

export async function GET(event: RequestEvent): Promise<Response> {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken()) as IClaims;
  const googleId = claims.sub;
  const username = sanitizeUsername(claims.name);
  const name = claims.name;
  const avatarUrl = claims.picture;
  const email = claims.email;

  const existingUser = await getUserFromProviderUserId(googleId);
  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: getUserOverviewUrl(existingUser.username),
      },
    });
  }

  const user = await createUser('google', googleId, {
    email,
    username,
    name,
    avatarUrl,
  });
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: getUserOverviewUrl(user.username),
    },
  });
}
