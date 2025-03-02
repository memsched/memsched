import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { ProviderId } from './oauth';

export async function createUser(
  providerId: ProviderId,
  providerUserId: string,
  email: string,
  username: string
): Promise<table.User> {
  let finalUsername = username;
  let count = 1;
  while (
    (await db.select().from(table.user).where(eq(table.user.username, finalUsername)).limit(1))
      .length > 0
  ) {
    finalUsername = `${username}${count}`;
    count++;
    // just in case
    if (count > 1000) {
      throw new Error('Unique username limit reached');
    }
  }

  const insertedUser = await db
    .insert(table.user)
    .values({
      email: email,
      username: finalUsername,
    })
    .returning();

  const user = insertedUser[0];

  await db.insert(table.authProvider).values({
    providerId,
    providerUserId,
    userId: user.id,
  });

  return user;
}

export async function getUserFromGitHubId(githubUserId: number): Promise<table.User | null> {
  const res = await db
    .select({ user: table.user })
    .from(table.user)
    .innerJoin(table.authProvider, eq(table.user.id, table.authProvider.userId))
    .where(eq(table.authProvider.providerUserId, githubUserId.toString()))
    .limit(1);

  return res.length > 0 ? res[0].user : null;
}
