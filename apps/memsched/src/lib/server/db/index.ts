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
import { drizzle as drizzleD1, DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/libsql';

export type DBType = DrizzleD1Database;

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
