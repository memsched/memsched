import { eq, and, not } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as table from '$lib/server/db/schema';
import type { ProviderId } from './oauth';
import type { DBType } from '$lib/server/db';

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

/**
 * Check if a username is valid (not reserved and not already taken)
 */
export async function isUsernameValid(
  db: DBType,
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  // Check if username is reserved
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return false;
  }

  // Check if username is already taken
  const query = excludeUserId
    ? db
        .select()
        .from(table.user)
        .where(and(eq(table.user.username, username), not(eq(table.user.id, excludeUserId))))
    : db.select().from(table.user).where(eq(table.user.username, username));

  const users = await query;
  return users.length === 0;
}

/**
 * Generate a unique username by appending numbers if necessary
 */
export async function generateUniqueUsername(db: DBType, baseUsername: string): Promise<string> {
  let finalUsername = baseUsername;
  let count = 1;

  // Check if username is empty, reserved, or already taken
  while (
    finalUsername === '' ||
    RESERVED_USERNAMES.includes(finalUsername.toLowerCase()) ||
    (await db.select().from(table.user).where(eq(table.user.username, finalUsername)).limit(1))
      .length > 0
  ) {
    finalUsername = `${baseUsername}${count}`;
    count++;
    if (count > 1000) {
      throw new Error('Unique username limit reached');
    }
  }

  return finalUsername;
}

/**
 * We assume that the user is not already linked to the providerId
 */
export async function createUser(
  db: DBType,
  providerId: ProviderId,
  providerUserId: string,
  userData: Omit<table.UserInsert, 'id'>
): Promise<table.User> {
  // Check if a user already exists with the given email
  const users = await db.select().from(table.user).where(eq(table.user.email, userData.email));

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
  const finalUsername = await generateUniqueUsername(db, userData.username);

  const user = (
    await db
      .insert(table.user)
      .values({
        id: uuidv4(),
        email: userData.email,
        username: finalUsername,
        name: userData.name ?? '',
        avatarUrl: userData.avatarUrl ?? null,
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
  db: DBType,
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
