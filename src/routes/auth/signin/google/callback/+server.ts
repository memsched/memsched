import { google } from '$lib/server/oauth';
import { createUser, getUserFromProviderUserId } from '$lib/server/queries';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import type { RequestEvent } from './$types';
import { getUserOverviewUrl } from '$lib/api';
import { sanitizeUsername } from '$lib/server/utils';
import { error } from '@sveltejs/kit';
import { oauthLimiter } from '$lib/server/rate-limiter';

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

  const googleId = claims.sub;
  const username = sanitizeUsername(claims.name);
  const name = claims.name;
  const avatarUrl = claims.picture;
  const email = claims.email;

  try {
    const existingUser = await getUserFromProviderUserId(event.locals.db, googleId);
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

    const user = await createUser(event.locals.db, 'google', googleId, {
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
  } catch (error) {
    console.error('Error in user creation or session management:', error);
    return new Response('Error creating user account. Please try again.', {
      status: 500,
    });
  }
}
