import { createClient } from '@libsql/client';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/libsql';

// Function to get database instance based on environment
export function getDB(platform?: App.Platform) {
  // If we're on Cloudflare or using wrangler (has platform with DB binding)
  if (import.meta.env.MODE !== 'development' && platform?.env?.DB) {
    return drizzleD1(platform.env.DB);
  }

  // Otherwise use local SQLite
  const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
  if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const client = createClient({ url: DATABASE_URL });
  return drizzle(client);
}
