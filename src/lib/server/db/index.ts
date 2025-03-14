import { drizzle } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

export type DBType = BaseSQLiteDatabase<'async', any, any, any>;

// Function to get database instance based on environment
export function getDB(platform?: App.Platform): DBType {
  // If we're on Cloudflare (has platform with DB binding)
  if (platform?.env?.DB) {
    return drizzleD1(platform.env.DB);
  }

  // Otherwise use local SQLite
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const client = createClient({ url: env.DATABASE_URL });
  return drizzle(client);
}
