import { sqliteTable, integer, text, primaryKey, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  admin: integer('admin', { mode: 'boolean' }).notNull().default(false),

  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),

  // Subscription fields
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionStatus: text('subscription_status').default('inactive'),
  stripePlanId: text('stripe_plan_id'),
  subscriptionPeriodEnd: integer('subscription_period_end', {
    mode: 'timestamp',
  }),
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).default(false),

  // GDPR fields
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  anonymized: integer('anonymized', { mode: 'boolean' }).default(false),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
});

export const authProvider = sqliteTable(
  'auth_provider',
  {
    providerId: text('provider_id', { enum: ['github', 'google'] }).notNull(),
    providerUserId: text('provider_user_id').notNull(), // Provider-specific user ID
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', {
      mode: 'timestamp',
    }).default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.providerId, table.providerUserId] })]
);

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
});

export const objective = sqliteTable('objective', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  startValue: real('start_value').notNull(),
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  goalType: text('goal_type', { enum: ['fixed', 'ongoing'] }).notNull(),
  endValue: real('end_value'),
  archived: integer('archived', { mode: 'boolean' }).notNull().default(false),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
});

export const objectiveLog = sqliteTable(
  'objective_log',
  {
    id: text('id').primaryKey(),
    value: real('value').notNull(),
    notes: text('notes'),
    loggedAt: integer('logged_at', {
      mode: 'timestamp',
    }).notNull(),

    objectiveId: text('objective_id')
      .notNull()
      .references(() => objective.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', {
      mode: 'timestamp',
    }).default(sql`(unixepoch())`),
  },
  (table) => [index('logged_at_index').on(table.loggedAt)]
);

export const widget = sqliteTable('widget', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  imageUrl: text('image_url'),
  imagePlacement: text('image_placement', { enum: ['left', 'right'] }).notNull(),
  textIcon: text('text_icon'),
  visibility: text('visibility', { enum: ['private', 'public'] })
    .notNull()
    .default('private'),

  padding: integer('padding').notNull(),
  border: integer('border', { mode: 'boolean' }).notNull(),
  borderWidth: integer('border_width').notNull(),
  borderRadius: integer('border_radius').notNull(),
  color: text('color').notNull(),
  accentColor: text('accent_color').notNull(),
  backgroundColor: text('background_color').notNull(),
  watermark: integer('watermark', { mode: 'boolean' }).notNull(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
});

export const widgetMetric = sqliteTable('widget_metric', {
  id: text('id').primaryKey(),
  value: real('value').notNull(),
  name: text('name'),
  calculationType: text('calculation_type', {
    enum: ['day', 'week', 'month', 'year', 'all time', 'percentage'],
  }).notNull(),
  valueDecimalPrecision: integer('value_decimal_precision').notNull(),

  order: integer('order').notNull(),

  objectiveId: text('objective_id')
    .notNull()
    .references(() => objective.id, { onDelete: 'cascade' }),
  widgetId: text('widget_id')
    .notNull()
    .references(() => widget.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
});

export const userDeletionLog = sqliteTable('user_deletion_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  reason: text('reason').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
});

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
export type AuthProvider = typeof authProvider.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Objective = typeof objective.$inferSelect;
export type Widget = typeof widget.$inferSelect;
export type WidgetMetric = typeof widgetMetric.$inferSelect;
export type WidgetJoinMetrics = Widget & {
  metrics: WidgetMetric[];
};
export type WidgetMetricPreview = Omit<
  WidgetMetric,
  'id' | 'userId' | 'createdAt' | 'widgetId' | 'objectiveId'
>;
export type WidgetPreview = Omit<Widget, 'id' | 'userId' | 'createdAt' | 'visibility'>;
export type WidgetJoinMetricsPreview = WidgetPreview & {
  metrics: WidgetMetricPreview[];
};
