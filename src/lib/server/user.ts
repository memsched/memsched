import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { ProviderId } from './oauth';

/**
 * We assume that the user is not already linked to the providerId
 */
export async function createUser(
  providerId: ProviderId,
  providerUserId: string,
  email: string,
  username: string
): Promise<table.User> {
  // Check if a user already exists with the given email
  const users = await db.select().from(table.user).where(eq(table.user.email, email)).limit(1);

  if (users.length > 0) {
    const user = users[0];

    // We assume that this auth provider is not already linked
    await db.insert(table.authProvider).values({
      providerId,
      providerUserId,
      userId: user.id,
    });

    return user;
  }

  // If no user exists, proceed with creating a new one
  let finalUsername = username;
  let count = 1;
  while (
    (await db.select().from(table.user).where(eq(table.user.username, finalUsername)).limit(1))
      .length > 0
  ) {
    finalUsername = `${username}${count}`;
    count++;
    if (count > 1000) {
      throw new Error('Unique username limit reached');
    }
  }

  const user = (
    await db
      .insert(table.user)
      .values({
        email: email,
        username: finalUsername,
      })
      .returning()
  )[0];

  await db.insert(table.authProvider).values({
    providerId,
    providerUserId,
    userId: user.id,
  });

  return user;
}

export async function getUserFromProviderUserId(
  providerUserId: string
): Promise<table.User | null> {
  const res = await db
    .select({ user: table.user })
    .from(table.user)
    .innerJoin(table.authProvider, eq(table.user.id, table.authProvider.userId))
    .where(eq(table.authProvider.providerUserId, providerUserId))
    .limit(1);

  return res.length > 0 ? res[0].user : null;
}
