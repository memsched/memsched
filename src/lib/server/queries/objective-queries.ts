import * as table from '../db/schema';
import { db } from '../db';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ResultSet } from '@libsql/client';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import { computeMetricValue, updateMetricValue, getMetricsFromWidgetId } from './metric-queries';
import { getWidgetFromObjectiveId } from './widget-queries';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import type { FormSchema } from '$lib/components/forms/objective-form/schema';

/**
 * Gets all objectives for a user
 * @param userId The user ID
 * @returns All objectives for the user
 */
export async function getUserObjectives(userId: string) {
  return await db
    .select()
    .from(table.objective)
    .where(eq(table.objective.userId, userId))
    .orderBy(desc(table.objective.createdAt));
}

/**
 * Gets active objectives for a user (not archived, not completed if fixed)
 * @param userId The user ID
 * @returns Active objectives
 */
export async function getUserActiveObjectives(userId: string) {
  return await db
    .select()
    .from(table.objective)
    .where(
      and(
        eq(table.objective.userId, userId),
        eq(table.objective.archived, false),
        or(
          eq(table.objective.goalType, 'ongoing'),
          sql`${table.objective.value} < ${table.objective.endValue} OR ${table.objective.endValue} IS NULL`
        )
      )
    )
    .orderBy(desc(table.objective.createdAt));
}

/**
 * Gets completed objectives for a user (fixed goals that have reached their target)
 * @param userId The user ID
 * @returns Completed objectives
 */
export async function getUserCompletedObjectives(userId: string) {
  return await db
    .select()
    .from(table.objective)
    .where(
      and(
        eq(table.objective.userId, userId),
        eq(table.objective.archived, false),
        eq(table.objective.goalType, 'fixed'),
        sql`${table.objective.value} >= ${table.objective.endValue} AND ${table.objective.endValue} IS NOT NULL`
      )
    )
    .orderBy(desc(table.objective.createdAt));
}

/**
 * Gets archived objectives for a user
 * @param userId The user ID
 * @returns Archived objectives
 */
export async function getUserArchivedObjectives(userId: string) {
  return await db
    .select()
    .from(table.objective)
    .where(and(eq(table.objective.userId, userId), eq(table.objective.archived, true)))
    .orderBy(desc(table.objective.createdAt));
}

/**
 * Gets a specific objective by ID, ensuring it belongs to the specified user
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns The objective if found, null otherwise
 */
export async function getUserObjective(
  objectiveId: string,
  userId: string,
  tx?: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) {
  const objectives = await (tx ?? db)
    .select()
    .from(table.objective)
    .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)));

  return objectives.length > 0 ? objectives[0] : null;
}

/**
 * Gets the objective associated with a widget
 * @param widgetId The widget ID
 * @returns The associated objective, or null if not found
 */
export async function getObjectiveFromWidgetId(widgetId: string) {
  const objectives = await db
    .select({
      objective: table.objective,
    })
    .from(table.widget)
    .innerJoin(table.objective, eq(table.objective.id, table.widget.objectiveId))
    .where(eq(table.widget.id, widgetId))
    .limit(1);

  if (objectives.length === 0) {
    return null;
  }

  return objectives[0].objective;
}

/**
 * Updates all widget metrics associated with an objective
 * @param tx The database transaction
 * @param objectiveId The ID of the objective
 */
export async function updateObjectiveWidgetMetrics(
  tx: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >,
  objectiveId: string
) {
  // Get all widgets associated with this objective
  const widgets = await getWidgetFromObjectiveId(objectiveId);

  // For each widget, update its metrics
  for (const widgetItem of widgets) {
    // Get all metrics for this widget
    const metrics = await getMetricsFromWidgetId(widgetItem.id, tx);

    // Update each metric with the new computed value
    for (const metric of metrics) {
      const newMetricValue = await computeMetricValue(
        tx,
        objectiveId,
        metric.timeRange,
        metric.valueDecimalPrecision
      );

      // Update the metric value
      await updateMetricValue(metric.id, newMetricValue, tx);
    }
  }
}

/**
 * Updates the value of an objective
 * @param objectiveId The objective ID
 * @param tx The database transaction
 * @param value The new value
 * @returns The updated objective
 */
export async function updateObjectiveValue(
  objectiveId: string,
  value: number,
  tx: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) {
  return (
    await tx
      .update(table.objective)
      .set({ value })
      .where(eq(table.objective.id, objectiveId))
      .returning()
  )[0];
}

/**
 * Toggles the archived status of an objective
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @throws Error if objective not found
 */
export async function toggleArchivedObjective(objectiveId: string, userId: string) {
  const objective = await getUserObjective(objectiveId, userId);
  if (!objective) {
    throw new Error('Objective not found');
  }

  await db
    .update(table.objective)
    .set({ archived: !objective.archived })
    .where(eq(table.objective.id, objectiveId));
}

/**
 * Creates a new objective with initial log entry
 * @param objectiveData Objective data from the form
 * @param userId The user ID
 * @returns The created objective
 */
export async function createUserObjective(objectiveData: z.infer<FormSchema>, userId: string) {
  let createdObjective;

  await db.transaction(async (tx) => {
    createdObjective = (
      await tx
        .insert(table.objective)
        .values({
          id: uuidv4(),
          name: objectiveData.name,
          description: objectiveData.description,
          startValue: objectiveData.startValue,
          value: objectiveData.startValue,
          unit: objectiveData.unit,
          visibility: objectiveData.visibility,
          goalType: objectiveData.goalType,
          endValue: objectiveData.endValue,
          userId,
        })
        .returning()
    )[0];

    await tx.insert(table.objectiveLog).values({
      id: uuidv4(),
      value: objectiveData.startValue,
      notes: '',
      loggedAt: new Date(),
      objectiveId: createdObjective.id,
      userId,
    });
  });

  return createdObjective;
}

/**
 * Updates an existing objective's details
 * @param objectiveId The objective ID
 * @param objectiveData The updated objective data
 * @param userId The user ID
 * @returns True if successful
 */
export async function updateUserObjective(
  objectiveId: string,
  objectiveData: z.infer<FormSchema>,
  userId: string
) {
  const objective = await getUserObjective(objectiveId, userId);
  if (!objective) {
    return false;
  }

  await db
    .update(table.objective)
    .set({
      name: objectiveData.name,
      description: objectiveData.description,
      unit: objectiveData.unit,
      visibility: objectiveData.visibility,
      endValue: objectiveData.endValue,
    })
    .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)));

  return true;
}

/**
 * Deletes an objective
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns True if successful
 */
export async function deleteUserObjective(objectiveId: string, userId: string) {
  const objective = await getUserObjective(objectiveId, userId);
  if (!objective) {
    return false;
  }

  await db
    .delete(table.objective)
    .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)));

  return true;
}
