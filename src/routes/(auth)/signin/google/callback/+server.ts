import { google } from '$lib/server/oauth';
import { createUser, getUserFromProviderUserId } from '$lib/server/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import type { RequestEvent } from './$types';

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
  } catch (e) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken()) as IClaims;
  const googleId = claims.sub;
  const name = claims.name;
  const picture = claims.picture;
  const email = claims.email;

  const existingUser = await getUserFromProviderUserId(googleId);
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

  const user = await createUser('google', googleId, email, name);
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
