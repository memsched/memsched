import { eq, and, not } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as table from '$lib/server/db/schema';
import type { ProviderId } from '../oauth';
import type { DBType } from '$lib/server/db';
import type { FormSchema } from '$lib/components/forms/profile-form/schema';
import type { z } from 'zod';
import {
  wrapResultAsync,
  wrapResultAsyncFn,
  DrizzleRecordNotFoundErrorCause,
} from '$lib/server/db/types';

// List of reserved usernames that cannot be used (route paths)
export const RESERVED_USERNAMES = [
  'objectives',
  'widgets',
  'settings',
  'explore',
  'auth',
  'api',
  'privacy',
  'tos',
  // Not currently used, but reserved for future use
  'signin',
  'signup',
  'logout',
  'admin',
  'profile',
  'notifications',
  'account',
  'home',
  'dashboard',
  'search',
  'docs',
  'new',
];

export class UsersService {
  constructor(private readonly db: DBType) {}

  public isUsernameValid(username: string, excludeUserId?: string) {
    return wrapResultAsyncFn(async () => {
      if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
        return false;
      }

      const query = excludeUserId
        ? this.db
            .select()
            .from(table.user)
            .where(and(eq(table.user.username, username), not(eq(table.user.id, excludeUserId))))
        : this.db.select().from(table.user).where(eq(table.user.username, username));

      const users = await query;
      return users.length === 0;
    });
  }

  public generateUniqueUsername(baseUsername: string) {
    return wrapResultAsyncFn(async () => {
      let finalUsername = baseUsername;
      let count = 1;

      while (true) {
        if (finalUsername !== '') {
          const isUsernameValid = await this.isUsernameValid(finalUsername);
          if (isUsernameValid.isErr()) {
            throw isUsernameValid.error;
          }

          if (isUsernameValid.value) {
            break;
          }
        }

        finalUsername = `${baseUsername}${count}`;
        count++;

        if (count > 1000) {
          throw new Error('Unique username limit reached');
        }
      }

      return finalUsername;
    });
  }

  public getUserByEmail(email: string) {
    return wrapResultAsyncFn(async () => {
      const users = await this.db.select().from(table.user).where(eq(table.user.email, email));
      return users.length > 0 ? users[0] : null;
    });
  }

  public createUser(
    providerId: ProviderId,
    providerUserId: string,
    userData: Omit<table.UserInsert, 'id'>
  ) {
    return wrapResultAsyncFn(async () => {
      const users = await this.getUserByEmail(userData.email);
      if (users.isErr()) {
        throw users.error;
      }

      if (users.value) {
        await this.db.insert(table.authProvider).values({
          providerId,
          providerUserId,
          userId: users.value.id,
        });

        return users.value;
      }

      const finalUsername = await this.generateUniqueUsername(userData.username);
      if (finalUsername.isErr()) {
        throw finalUsername.error;
      }

      const user = (
        await this.db
          .insert(table.user)
          .values({
            id: uuidv4(),
            email: userData.email,
            username: finalUsername.value,
            name: userData.name ?? '',
            avatarUrl: userData.avatarUrl ?? null,
          })
          .returning()
      )[0];

      await this.db.insert(table.authProvider).values({
        providerId,
        providerUserId,
        userId: user.id,
      });

      return user;
    });
  }

  public getUserFromProviderUserId(providerUserId: string) {
    return wrapResultAsyncFn(async () => {
      const res = await this.db
        .select({ user: table.user })
        .from(table.user)
        .innerJoin(table.authProvider, eq(table.user.id, table.authProvider.userId))
        .where(eq(table.authProvider.providerUserId, providerUserId))
        .limit(1);

      return res.length > 0 ? res[0].user : null;
    });
  }

  public getUserByUsername(username: string) {
    return wrapResultAsyncFn(async () => {
      const users = await this.db
        .select()
        .from(table.user)
        .where(eq(table.user.username, username));
      if (users.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('User not found');
      }
      return users[0];
    });
  }

  public updateUser(userId: string, userData: z.infer<FormSchema>) {
    return wrapResultAsync(
      this.db
        .update(table.user)
        .set({
          username: userData.username,
          name: userData.name,
          bio: userData.bio || null,
          location: userData.location || null,
          website: userData.website || null,
        })
        .where(eq(table.user.id, userId))
    );
  }

  public deleteUser(userId: string) {
    return wrapResultAsync(this.db.delete(table.user).where(eq(table.user.id, userId)));
  }
}
