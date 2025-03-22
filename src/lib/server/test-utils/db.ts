import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';
import * as schema from '$lib/server/db/schema';
import type { DBType } from '$lib/server/db';

// Path to the migrations directory
const MIGRATIONS_PATH = path.resolve('./drizzle');

/**
 * Set up a test database, run migrations, and return a Drizzle client
 */
export async function setupTestDB(): Promise<DBType> {
  // Create a new SQLite client pointing to our test database
  const client = createClient({
    url: ':memory:',
  });

  // Create a Drizzle instance
  const db = drizzle(client);

  // Run migrations
  await migrate(db, { migrationsFolder: MIGRATIONS_PATH });

  return db as unknown as DBType;
}

/**
 * Seed the test database with initial data for testing
 */
export async function seedTestData(db: DBType): Promise<{
  testUsers: schema.User[];
}> {
  // Create test users
  const testUsers = [
    {
      id: '1',
      email: 'test1@example.com',
      username: 'testuser1',
      name: 'Test User 1',
      avatarUrl: null,
      bio: null,
      location: null,
      website: null,
    },
    {
      id: '2',
      email: 'test2@example.com',
      username: 'testuser2',
      name: 'Test User 2',
      avatarUrl: null,
      bio: null,
      location: null,
      website: null,
    },
    {
      id: '3',
      email: 'reserved@example.com',
      username: 'existing-reserved-name',
      name: 'Reserved Name User',
      avatarUrl: null,
      bio: null,
      location: null,
      website: null,
    },
  ] as schema.UserInsert[];

  // Insert test users
  await db.insert(schema.user).values(testUsers);

  return {
    testUsers: testUsers as schema.User[],
  };
}
