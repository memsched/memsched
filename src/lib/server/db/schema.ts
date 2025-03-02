import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const authProvider = sqliteTable(
  'auth_provider',
  {
    providerId: text('provider_id').notNull(), // "github", "google"
    providerUserId: text('provider_user_id').notNull(), // Provider-specific user ID
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', {
      mode: 'timestamp',
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [primaryKey({ columns: [table.providerId, table.providerUserId] })]
);

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
});

export type User = typeof user.$inferSelect;
export type AuthProvided = typeof authProvider.$inferSelect;
export type Session = typeof session.$inferSelect;
