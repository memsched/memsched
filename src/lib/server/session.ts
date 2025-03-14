import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import * as table from '$lib/server/db/schema';
import type { DBType } from '$lib/server/db';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const SESSION_COOKIE_NAME = 'auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase32(bytes).toLowerCase();
  return token;
}

export async function createSession(db: DBType, token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: table.Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
  };
  await db.insert(table.session).values(session);
  return session;
}

export async function validateSessionToken(db: DBType, token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db
    .select({
      // Adjust user table here to tweak returned data
      user: {
        id: table.user.id,
        email: table.user.email,
        username: table.user.username,
        name: table.user.name,
        avatarUrl: table.user.avatarUrl,
        bio: table.user.bio,
        location: table.user.location,
        website: table.user.website,
      },
      session: table.session,
    })
    .from(table.session)
    .innerJoin(table.user, eq(table.session.userId, table.user.id))
    .where(eq(table.session.id, sessionId));

  if (!result) {
    return { session: null, user: null };
  }
  const { session, user } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await invalidateSession(db, session.id);
    return { session: null, user: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await db
      .update(table.session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.session.id, session.id));
  }

  return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(db: DBType, sessionId: string) {
  await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export async function invalidateAllSessions(db: DBType, userId: string): Promise<void> {
  await db.delete(table.session).where(eq(table.session.userId, userId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  event.cookies.set(SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
  });
}
