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
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';

import type { DBType } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

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
