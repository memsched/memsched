import { drizzle } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1, DrizzleD1Database } from 'drizzle-orm/d1';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

export type DBType = DrizzleD1Database;

// Function to get database instance based on environment
export function getDB(platform?: App.Platform) {
  // If we're on Cloudflare (has platform with DB binding)
  if (!import.meta.env.DEV && platform?.env?.DB) {
    return drizzleD1(platform.env.DB);
  }

  // Otherwise use local SQLite
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const client = createClient({ url: env.DATABASE_URL });
  return drizzle(client);
}
