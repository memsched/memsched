import * as table from '../db/schema';
import type { WidgetJoinMetrics } from '../db/schema';
import { db } from '../db';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import { type FormSchema } from '$lib/components/forms/widget-form/schema';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ResultSet } from '@libsql/client';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import { computeMetricValue } from './metric-queries';
import { getUserObjective } from './objective-queries';

/**
 * Gets widgets for a user based on completion status
 * @param userId The user ID
 * @param completed Whether to get completed widgets
 * @returns Widget IDs
 */
export async function getUserWidgets(userId: string, completed: boolean = false) {
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
 * @param objectiveId The objective ID
 * @returns The widgets
 */
export async function getWidgetFromObjectiveId(objectiveId: string) {
  return await db.select().from(table.widget).where(eq(table.widget.objectiveId, objectiveId));
}

/**
 * Gets a widget with its metrics
 * @param id The widget ID
 * @returns The widget with metrics, or null if not found
 */
export async function getWidgetWithMetrics(id: string) {
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
 * @param widgetId The widget ID
 * @param userId The user ID
 * @returns The widget or null if not found
 */
export async function getUserWidget(
  widgetId: string,
  userId: string,
  tx?: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) {
  const widgets = await (tx ?? db)
    .select()
    .from(table.widget)
    .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

  return widgets.length > 0 ? widgets[0] : null;
}

/**
 * Creates a new widget with associated metrics
 * @param widgetData Widget data from the form
 * @param userId The user ID
 * @returns The created widget ID
 */
export async function createUserWidget(widgetData: z.infer<FormSchema>, userId: string) {
  const widgetId = uuidv4();

  await db.transaction(async (tx) => {
    // First check if the objective exists and belongs to the user
    const objective = await getUserObjective(widgetData.objectiveId, userId, tx);
    if (!objective) {
      throw new Error('Objective not found');
    }

    // Insert the widget
    const widget = (
      await tx
        .insert(table.widget)
        .values({
          id: widgetId,
          title: widgetData.title,
          subtitle: widgetData.subtitle,
          imageUrl: widgetData.imageUrl,
          imagePlacement: widgetData.imagePlacement,

          padding: widgetData.padding,
          border: widgetData.border,
          borderWidth: 1,
          borderRadius: widgetData.borderRadius,
          color: widgetData.color,
          accentColor: widgetData.accentColor,
          backgroundColor: widgetData.backgroundColor,
          watermark: true, // Default to true, update when user has pro plan

          objectiveId: widgetData.objectiveId,
          userId,
        })
        .returning()
    )[0];

    // Insert the metrics
    for (const [i, metric] of widgetData.metrics.entries()) {
      const value = await computeMetricValue(
        tx,
        objective.id,
        metric.timeRange,
        metric.valueDecimalPrecision
      );

      await tx.insert(table.widgetMetric).values({
        id: uuidv4(),
        value,
        name: metric.name,
        timeRange: metric.timeRange,
        valueDecimalPrecision: metric.valueDecimalPrecision,

        order: i + 1,
        widgetId: widget.id,
        userId,
      });
    }
  });

  return widgetId;
}

/**
 * Updates an existing widget and its metrics
 * @param widgetId The widget ID
 * @param widgetData Widget data from the form
 * @param userId The user ID
 * @returns True if successful
 */
export async function updateUserWidget(
  widgetId: string,
  widgetData: z.infer<FormSchema>,
  userId: string
) {
  let success = false;

  await db.transaction(async (tx) => {
    // Check if the widget exists and belongs to the user
    const widget = await getUserWidget(widgetId, userId, tx);
    if (!widget) {
      throw new Error('Widget not found');
    }

    // Check if the objective exists and belongs to the user
    const objective = await getUserObjective(widgetData.objectiveId, userId, tx);
    if (!objective) {
      throw new Error('Objective not found');
    }

    // Update the widget
    await tx
      .update(table.widget)
      .set({
        title: widgetData.title,
        subtitle: widgetData.subtitle,
        imageUrl: widgetData.imageUrl,
        imagePlacement: widgetData.imagePlacement,

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
      })
      .where(eq(table.widget.id, widgetId));

    // Delete all existing metrics
    await tx.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId));

    // Insert new metrics
    for (const [i, metric] of widgetData.metrics.entries()) {
      const value = await computeMetricValue(
        tx,
        objective.id,
        metric.timeRange,
        metric.valueDecimalPrecision
      );

      await tx.insert(table.widgetMetric).values({
        id: uuidv4(),
        value,
        name: metric.name,
        timeRange: metric.timeRange,
        valueDecimalPrecision: metric.valueDecimalPrecision,
        order: i + 1,
        widgetId: widgetId,
        userId,
      });
    }

    success = true;
  });

  return success;
}

/**
 * Deletes a widget and its associated metrics
 * @param widgetId The widget ID
 * @param userId The user ID
 * @returns True if successful, false if widget not found
 */
export async function deleteUserWidget(widgetId: string, userId: string) {
  const widget = await getUserWidget(widgetId, userId);
  if (!widget) {
    return false;
  }

  await db
    .delete(table.widget)
    .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));
  return true;
}
