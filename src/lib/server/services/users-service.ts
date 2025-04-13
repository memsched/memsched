import { and, eq, not } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import type { FormSchema } from '$lib/components/forms/profile-form/schema';
import type { DBType } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import {
  DrizzleRecordNotFoundErrorCause,
  wrapResultAsync,
  wrapResultAsyncFn,
} from '$lib/server/db/types';

import type { ProviderId } from '../oauth';
import { PaymentService } from './payment-service';

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
  'docs',
  'objects',
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
  'new',
];

// Add these types at the top after the imports
interface AnonymizedUserData {
  email: string;
  name: string;
  username: string;
}

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

  public getByEmail(email: string) {
    return wrapResultAsyncFn(async () => {
      const users = await this.db.select().from(table.user).where(eq(table.user.email, email));
      return users.length > 0 ? users[0] : null;
    });
  }

  public create(
    providerId: ProviderId,
    providerUserId: string,
    userData: Omit<table.UserInsert, 'id'>
  ) {
    return wrapResultAsyncFn(async () => {
      const users = await this.getByEmail(userData.email);
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

  public getByProviderUserId(providerUserId: string) {
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

  public getByUsername(username: string) {
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

  public update(userId: string, userData: z.infer<FormSchema>) {
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

  private async createAnonymizedData(): Promise<AnonymizedUserData> {
    const uuid = uuidv4();
    return {
      email: `deleted_${uuid}@deleted.local`,
      name: 'Deleted User',
      username: `deleted_${uuid}`,
    };
  }

  public delete(userId: string, reason?: string) {
    return wrapResultAsyncFn(async () => {
      // 1. Get user data before deletion
      const users = await this.db.select().from(table.user).where(eq(table.user.id, userId));
      if (users.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('User not found');
      }
      const user = users[0];

      // 2. Clean up Stripe data if exists
      if (user.stripeCustomerId) {
        const paymentService = new PaymentService(this.db);
        const cleanupResult = await paymentService.cleanupCustomerData(userId);
        if (cleanupResult.isErr()) {
          throw cleanupResult.error;
        }
      }
      // Anonymize user data
      const anonymizedData = await this.createAnonymizedData();

      await this.db.batch([
        // Delete all related data
        this.db.delete(table.session).where(eq(table.session.userId, userId)),
        this.db.delete(table.authProvider).where(eq(table.authProvider.userId, userId)),
        this.db.delete(table.objective).where(eq(table.objective.userId, userId)),
        // Anonymize user data
        this.db
          .update(table.user)
          .set({
            email: anonymizedData.email,
            name: anonymizedData.name,
            username: anonymizedData.username,
            avatarUrl: null,
            bio: null,
            location: null,
            website: null,
            stripeCustomerId: null,
            stripePlanId: null,
            subscriptionStatus: null,
            subscriptionPeriodEnd: null,
            cancelAtPeriodEnd: null,
            deletedAt: new Date(),
            anonymized: true,
          })
          .where(eq(table.user.id, userId)),
        // Create audit log entry
        this.db.insert(table.userDeletionLog).values({
          id: uuidv4(),
          userId: userId,
          reason: reason || 'user_requested',
          deletedAt: new Date(),
        }),
      ]);

      return { success: true };
    });
  }

  public getUsernames() {
    return wrapResultAsyncFn(async () => {
      const users = await this.db.select({ username: table.user.username }).from(table.user);
      return users.map((user) => user.username);
    });
  }

  public updateAvatar(userId: string, avatarUrl: string) {
    return wrapResultAsync(
      this.db.update(table.user).set({ avatarUrl }).where(eq(table.user.id, userId))
    );
  }
}
