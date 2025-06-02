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
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { getUserOverviewUrl } from '$lib/api';
import type { DBType } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { wrapResultAsync, wrapResultAsyncFn } from '$lib/server/db/types';
import type { ProviderId } from '$lib/server/oauth';
import { handleDbError } from '$lib/server/utils';

interface AuthUserData {
  providerId: ProviderId;
  providerUserId: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const SESSION_COOKIE_NAME = 'auth-session';

export class SessionsService {
  constructor(private readonly db: DBType) {}

  public generateSessionToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(18));
    const token = encodeBase32(bytes).toLowerCase();
    return token;
  }

  public createSession(token: string, userId: string) {
    return wrapResultAsyncFn(async () => {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
      const session: table.Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
      };
      await this.db.insert(table.session).values(session);
      return session;
    });
  }

  public validateSessionToken(token: string) {
    return wrapResultAsyncFn(async () => {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
      const [result] = await this.db
        .select({
          user: {
            id: table.user.id,
            admin: table.user.admin,
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
        await this.invalidateSession(session.id);
        return { session: null, user: null };
      }

      const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
      if (renewSession) {
        session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
        await this.db
          .update(table.session)
          .set({ expiresAt: session.expiresAt })
          .where(eq(table.session.id, session.id));
      }

      return { session, user };
    });
  }

  public invalidateSession(sessionId: string) {
    return wrapResultAsync(this.db.delete(table.session).where(eq(table.session.id, sessionId)));
  }

  public invalidateAllSessions(userId: string) {
    return wrapResultAsync(this.db.delete(table.session).where(eq(table.session.userId, userId)));
  }

  public setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
    event.cookies.set(SESSION_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      expires: expiresAt,
    });
  }

  public deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.delete(SESSION_COOKIE_NAME, {
      path: '/',
    });
  }

  public async handleUserAuthentication(
    event: RequestEvent,
    userData: AuthUserData,
    usersService = event.locals.usersService
  ): Promise<Response> {
    // Check for existing user
    const existingUserResult = await usersService.getByProviderUserId(userData.providerUserId);
    if (existingUserResult.isErr()) {
      return handleDbError(existingUserResult);
    }

    const existingUser = existingUserResult.value;

    // Handle session creation and redirect
    if (existingUser !== null) {
      return await this.createSessionAndRedirect(event, existingUser.id, existingUser.username);
    }

    // Create new user
    const userResult = await usersService.create(userData.providerId, userData.providerUserId, {
      email: userData.email,
      username: userData.username,
      name: userData.name,
      avatarUrl: userData.avatarUrl,
    });

    if (userResult.isErr()) {
      return handleDbError(userResult);
    }

    const user = userResult.value;
    return await this.createSessionAndRedirect(event, user.id, user.username);
  }

  private async createSessionAndRedirect(
    event: RequestEvent,
    userId: string,
    username: string
  ): Promise<Response> {
    const sessionToken = this.generateSessionToken();
    const session = await this.createSession(sessionToken, userId);

    if (session.isErr()) {
      return handleDbError(session);
    }

    this.setSessionTokenCookie(event, sessionToken, session.value.expiresAt);

    return new Response(null, {
      status: 302,
      headers: {
        Location: getUserOverviewUrl(username),
      },
    });
  }
}

export type SessionValidationResult = Awaited<ReturnType<SessionsService['validateSessionToken']>>;
