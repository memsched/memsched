import * as table from '../db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import { computeMetricValue, updateMetricValue, getMetricsFromWidgetId } from './metric-queries';
import { getWidgetsFromObjectiveId } from './widget-queries';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import type { FormSchema } from '$lib/components/forms/objective-form/schema';
import type { DBType } from '../db';
import type { CacheService } from '../cache';

/**
 * Gets all objectives for a user
 * @param db The database instance
 * @param userId The user ID
 * @returns All objectives for the user
 */
export async function getUserObjectives(db: DBType, userId: string) {
  return await db
    .select()
    .from(table.objective)
    .where(eq(table.objective.userId, userId))
    .orderBy(desc(table.objective.createdAt));
}

/**
 * Gets active objectives for a user (not archived, not completed if fixed)
 * @param db The database instance
 * @param userId The user ID
 * @returns Active objectives
 */
export async function getUserActiveObjectives(db: DBType, userId: string) {
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
 * @param db The database instance
 * @param userId The user ID
 * @returns Completed objectives
 */
export async function getUserCompletedObjectives(db: DBType, userId: string) {
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
 * @param db The database instance
 * @param userId The user ID
 * @returns Archived objectives
 */
export async function getUserArchivedObjectives(db: DBType, userId: string) {
  return await db
    .select()
    .from(table.objective)
    .where(and(eq(table.objective.userId, userId), eq(table.objective.archived, true)))
    .orderBy(desc(table.objective.createdAt));
}

/**
 * Gets a specific objective by ID, ensuring it belongs to the specified user
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns The objective if found, null otherwise
 */
export async function getUserObjective(db: DBType, objectiveId: string, userId: string) {
  const objectives = await db
    .select()
    .from(table.objective)
    .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)));

  return objectives.length > 0 ? objectives[0] : null;
}

/**
 * Gets the objective associated with a widget
 * @param db The database instance
 * @param widgetId The widget ID
 * @returns The associated objective, or null if not found
 */
export async function getObjectiveFromWidgetId(db: DBType, widgetId: string) {
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
 * @param db The database instance
 * @param objectiveId The ID of the objective
 * @param cache The cache instance
 */
export async function updateObjectiveWidgetMetrics(
  db: DBType,
  objectiveId: string,
  cache: CacheService
) {
  // Get all widgets associated with this objective
  const widgets = await getWidgetsFromObjectiveId(db, objectiveId);

  // For each widget, update its metrics
  for (const widgetItem of widgets) {
    // Get all metrics for this widget
    const metrics = await getMetricsFromWidgetId(db, widgetItem.id);

    // Update each metric with the new computed value
    for (const metric of metrics) {
      const newMetricValue = await computeMetricValue(
        db,
        objectiveId,
        metric.calculationType,
        metric.valueDecimalPrecision
      );

      // Update the metric value
      await updateMetricValue(db, metric.id, newMetricValue, cache);
    }
  }
}

/**
 * Updates the value of an objective
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param value The new value
 * @returns The updated objective
 */
export async function updateObjectiveValue(db: DBType, objectiveId: string, value: number) {
  return (
    await db
      .update(table.objective)
      .set({ value })
      .where(eq(table.objective.id, objectiveId))
      .returning()
  )[0];
}

/**
 * Toggles the archived status of an objective
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @throws Error if objective not found
 */
export async function toggleArchivedObjective(db: DBType, objectiveId: string, userId: string) {
  const objective = await getUserObjective(db, objectiveId, userId);
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
 * @param db The database instance
 * @param objectiveData Objective data from the form
 * @param userId The user ID
 * @returns The created objective
 */
export async function createUserObjective(
  db: DBType,
  objectiveData: z.infer<FormSchema>,
  userId: string
) {
  const objectiveId = uuidv4();
  const batchRes = await db.batch([
    db
      .insert(table.objective)
      .values({
        id: objectiveId,
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
      .returning(),
    db.insert(table.objectiveLog).values({
      id: uuidv4(),
      value: objectiveData.startValue,
      notes: '',
      loggedAt: new Date(),
      objectiveId,
      userId,
    }),
  ]);

  return batchRes[0][0];
}

/**
 * Updates an existing objective's details
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param objectiveData The updated objective data
 * @param userId The user ID
 * @returns True if successful
 */
export async function updateUserObjective(
  db: DBType,
  objectiveId: string,
  objectiveData: z.infer<FormSchema>,
  userId: string
) {
  const objective = await getUserObjective(db, objectiveId, userId);
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
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns True if successful
 */
export async function deleteUserObjective(db: DBType, objectiveId: string, userId: string) {
  const objective = await getUserObjective(db, objectiveId, userId);
  if (!objective) {
    return false;
  }

  await db
    .delete(table.objective)
    .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)));

  return true;
}
