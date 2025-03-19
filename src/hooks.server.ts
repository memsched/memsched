import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getDB } from '$lib/server/db';
import { getCache } from '$lib/server/cache';
import {
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  SESSION_COOKIE_NAME,
} from '$lib/server/session';

// This will handle database injection
const dbHandle: Handle = async ({ event, resolve }) => {
  // Make database available via event.platform
  event.locals.db = getDB(event.platform);
  event.locals.cache = getCache(event.platform);
  return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE_NAME) ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await validateSessionToken(event.locals.db, token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  event.locals.session = session;
  event.locals.user = user;
  return resolve(event);
};

// Apply database handle first, then auth handle
export const handle = sequence(dbHandle, authHandle);
