import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const authProvider = sqliteTable(
  'auth_provider',
  {
    providerId: text('provider_id').notNull(), // "github", "google"
    providerUserId: text('provider_user_id').notNull(), // Provider-specific user ID
    userId: integer('user_id')
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
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
});

export const objective = sqliteTable('objective', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  startValue: integer('start_value').notNull(),
  unit: text('unit').notNull(),
  visibility: text('visibility').notNull(),
  goalType: text('goal_type').notNull(),
  endValue: integer('end_value'),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
export type AuthProvider = typeof authProvider.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Objective = typeof objective.$inferSelect;
export type ObjectiveInsert = typeof objective.$inferInsert;
