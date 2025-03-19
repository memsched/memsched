import * as table from '../db/schema';
import type { WidgetJoinMetrics } from '../db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import { type FormSchema } from '$lib/components/forms/widget-form/schema';
import { computeMetricValue } from './metric-queries';
import { getUserObjective } from './objective-queries';
import type { DBType } from '../db';
import type { CacheService } from '../cache';

/**
 * Gets widgets for a user based on completion status
 * @param db The database instance
 * @param userId The user ID
 * @param completed Whether to get completed widgets
 * @returns Widget IDs
 */
export async function getUserWidgets(db: DBType, userId: string, completed: boolean = false) {
  const conditions = eq(table.widget.userId, userId);

  if (completed) {
    // Get completed widgets (associated with completed fixed objectives)
    return await db
      .select({ id: table.widget.id })
      .from(table.widget)
      .innerJoin(table.objective, eq(table.widget.objectiveId, table.objective.id))
      .where(
        and(
          conditions,
          eq(table.objective.goalType, 'fixed'),
          sql`${table.objective.value} >= ${table.objective.endValue} AND ${table.objective.endValue} IS NOT NULL`
        )
      )
      .orderBy(desc(table.widget.createdAt));
  } else {
    // Get active widgets (associated with non-completed or ongoing objectives)
    return await db
      .select({ id: table.widget.id })
      .from(table.widget)
      .innerJoin(table.objective, eq(table.widget.objectiveId, table.objective.id))
      .where(
        and(
          conditions,
          or(
            eq(table.objective.goalType, 'ongoing'),
            sql`${table.objective.value} < ${table.objective.endValue} OR ${table.objective.endValue} IS NULL`
          )
        )
      )
      .orderBy(desc(table.widget.createdAt));
  }
}

/**
 * Gets widgets from an objective ID
 * @param db The database instance
 * @param objectiveId The objective ID
 * @returns The widgets
 */
export async function getWidgetsFromObjectiveId(db: DBType, objectiveId: string) {
  return await db.select().from(table.widget).where(eq(table.widget.objectiveId, objectiveId));
}

/**
 * Gets a widget with its metrics
 * @param db The database instance
 * @param id The widget ID
 * @returns The widget with metrics, or null if not found
 */
export async function getWidgetWithMetrics(db: DBType, id: string) {
  const widgetWithMetrics = await db
    .select({
      widget: table.widget,
      widgetMetric: table.widgetMetric,
    })
    .from(table.widget)
    .leftJoin(table.widgetMetric, eq(table.widget.id, table.widgetMetric.widgetId))
    .where(eq(table.widget.id, id));

  if (!widgetWithMetrics.length) return null;

  const widgetData = widgetWithMetrics[0].widget;
  const metrics = widgetWithMetrics.map(({ widgetMetric }) => widgetMetric).filter(Boolean);

  return { ...widgetData, metrics } as WidgetJoinMetrics;
}

/**
 * Gets a widget by ID and user ID
 * @param db The database instance
 * @param widgetId The widget ID
 * @param userId The user ID
 * @returns The widget or null if not found
 */
export async function getUserWidget(db: DBType, widgetId: string, userId: string) {
  const widgets = await db
    .select()
    .from(table.widget)
    .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

  return widgets.length > 0 ? widgets[0] : null;
}

/**
 * Creates a new widget with associated metrics
 * @param db The database instance
 * @param widgetData Widget data from the form
 * @param userId The user ID
 * @returns The created widget ID
 */
export async function createUserWidget(
  db: DBType,
  widgetData: z.infer<FormSchema>,
  userId: string
) {
  // First check if the objective exists and belongs to the user
  const objective = await getUserObjective(db, widgetData.objectiveId, userId);
  if (!objective) {
    throw new Error('Objective not found');
  }

  const widgetId = uuidv4();

  // Create the metrics to insert
  const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
  for (let i = 0; i < widgetData.metrics.length; i++) {
    const metric = widgetData.metrics[i];
    const value = await computeMetricValue(
      db,
      objective.id,
      metric.calculationType,
      metric.valueDecimalPrecision
    );
    metricInserts.push({
      id: uuidv4(),
      value,
      name: metric.name,
      calculationType: metric.calculationType,
      valueDecimalPrecision: metric.valueDecimalPrecision,
      order: i,
      widgetId,
      userId,
    });
  }

  const widgetInsert: Omit<table.Widget, 'createdAt'> = {
    id: widgetId,
    title: widgetData.title,
    subtitle: widgetData.subtitle,
    imageUrl: widgetData.imageUrl,
    imagePlacement: widgetData.imagePlacement,
    textIcon: widgetData.textIcon,

    padding: widgetData.padding,
    border: widgetData.border,
    borderWidth: 1,
    borderRadius: widgetData.borderRadius,
    color: widgetData.color,
    accentColor: widgetData.accentColor,
    backgroundColor: widgetData.backgroundColor,
    watermark: true, // TODO: Default to true, update when user has pro plan

    objectiveId: widgetData.objectiveId,
    userId,
  };

  if (metricInserts.length > 0) {
    await db.batch([
      db.insert(table.widget).values(widgetInsert),
      db.insert(table.widgetMetric).values(metricInserts),
    ]);
  } else {
    await db.batch([db.insert(table.widget).values(widgetInsert)]);
  }

  return widgetId;
}

/**
 * Updates an existing widget and its metrics
 * @param db The database instance
 * @param widgetId The widget ID
 * @param widgetData Widget data from the form
 * @param userId The user ID
 */
export async function updateUserWidget(
  db: DBType,
  widgetId: string,
  widgetData: z.infer<FormSchema>,
  userId: string,
  cache: CacheService
) {
  // Check if the widget exists and belongs to the user
  const widget = await getUserWidget(db, widgetId, userId);
  if (!widget) {
    throw new Error('Widget not found');
  }

  // Check if the objective exists and belongs to the user
  const objective = await getUserObjective(db, widgetData.objectiveId, userId);
  if (!objective) {
    throw new Error('Objective not found');
  }

  // Create the metrics to insert
  const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
  for (let i = 0; i < widgetData.metrics.length; i++) {
    const metric = widgetData.metrics[i];
    const value = await computeMetricValue(
      db,
      objective.id,
      metric.calculationType,
      metric.valueDecimalPrecision
    );
    metricInserts.push({
      id: uuidv4(),
      value,
      name: metric.name,
      calculationType: metric.calculationType,
      valueDecimalPrecision: metric.valueDecimalPrecision,
      order: i,
      widgetId,
      userId,
    });
  }

  const widgetUpdate: Omit<table.Widget, 'id' | 'watermark' | 'userId' | 'createdAt'> = {
    title: widgetData.title,
    subtitle: widgetData.subtitle,
    imageUrl: widgetData.imageUrl,
    imagePlacement: widgetData.imagePlacement,
    textIcon: widgetData.textIcon,

    padding: widgetData.padding,
    border: widgetData.border,
    borderWidth: 1,
    borderRadius: widgetData.borderRadius,
    color: widgetData.color,
    accentColor: widgetData.accentColor,
    backgroundColor: widgetData.backgroundColor,

    objectiveId: widgetData.objectiveId,
    // Don't update userId as it should remain the same
    // Don't update watermark status as it's dependent on user plan
  };

  if (metricInserts.length > 0) {
    await db.batch([
      db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId)),
      // Delete all existing metrics
      db.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId)),
      // Insert new metrics
      db.insert(table.widgetMetric).values(metricInserts),
    ]);
  } else {
    await db.batch([
      db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId)),
      // Delete all existing metrics
      db.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId)),
    ]);
  }

  // Invalidate the widget cache
  await Promise.all([
    cache.delete(`widget:${widgetId}:html`),
    cache.delete(`widget:${widgetId}:svg`),
  ]);
}

/**
 * Deletes a widget and its associated metrics
 * @param db The database instance
 * @param widgetId The widget ID
 * @param userId The user ID
 * @param cache The cache instance
 * @returns True if successful, false if widget not found
 */
export async function deleteUserWidget(
  db: DBType,
  widgetId: string,
  userId: string,
  cache: CacheService
) {
  const widget = await getUserWidget(db, widgetId, userId);
  if (!widget) {
    return false;
  }

  await db
    .delete(table.widget)
    .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

  // Invalidate the widget cache
  await Promise.all([
    cache.delete(`widget:${widgetId}:html`),
    cache.delete(`widget:${widgetId}:svg`),
  ]);

  return true;
}

/**
 * Counts the number of widgets a user has
 * @param db The database instance
 * @param userId The user ID
 * @returns The number of widgets the user has
 */
export async function getUserWidgetCount(db: DBType, userId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(table.widget)
    .where(eq(table.widget.userId, userId));
  return result[0].count;
}
