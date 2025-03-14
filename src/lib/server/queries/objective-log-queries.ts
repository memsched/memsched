import * as table from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import type { LogSchema } from '$lib/components/forms/objective-log-form/schema';
import {
  getUserObjective,
  updateObjectiveValue,
  updateObjectiveWidgetMetrics,
} from './objective-queries';
import type { Objective } from '../db/schema';
import type { DBType } from '../db';

/**
 * Gets logs for a specific objective
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns Logs for the objective
 */
export async function getObjectiveLogs(db: DBType, objectiveId: string, userId: string) {
  return await db
    .select()
    .from(table.objectiveLog)
    .where(
      and(eq(table.objectiveLog.objectiveId, objectiveId), eq(table.objectiveLog.userId, userId))
    )
    .orderBy(desc(table.objectiveLog.loggedAt));
}

/**
 * Gets the most recent log for a specific objective
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns The most recent log, or null if no logs exist
 */
export async function getMostRecentObjectiveLog(db: DBType, objectiveId: string, userId: string) {
  const logs = await db
    .select()
    .from(table.objectiveLog)
    .where(
      and(eq(table.objectiveLog.objectiveId, objectiveId), eq(table.objectiveLog.userId, userId))
    )
    .orderBy(desc(table.objectiveLog.loggedAt))
    .limit(1);

  return logs.length > 0 ? logs[0] : null;
}

/**
 * Adds a new log entry for an objective and updates its value
 * @param db The database instance
 * @param logData Log data
 * @param userId The user ID
 * @returns The objective after update, or null if objective not found
 */
export async function logObjectiveProgress(
  db: DBType,
  logData: z.infer<LogSchema>,
  userId: string
) {
  let updatedObjective = null;

  await db.transaction(async (tx) => {
    // Get the objective and verify ownership
    const targetObjective = await getUserObjective(tx, logData.objectiveId, userId);
    if (!targetObjective) {
      throw new Error('Objective not found');
    }

    // Create the log entry
    await tx.insert(table.objectiveLog).values({
      id: uuidv4(),
      value: logData.value,
      notes: logData.notes || null,
      loggedAt: new Date(),
      objectiveId: logData.objectiveId,
      userId,
    });

    // Update the objective's current value
    const newValue = targetObjective.value + logData.value;
    updatedObjective = await updateObjectiveValue(tx, logData.objectiveId, newValue);

    // Update all widget metrics for this objective
    await updateObjectiveWidgetMetrics(tx, logData.objectiveId);
  });

  return updatedObjective as Objective | null;
}

/**
 * Undoes (removes) the most recent log entry for an objective
 * @param db The database instance
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns The removed log or null if no logs exist
 */
export async function undoObjectiveLog(db: DBType, objectiveId: string, userId: string) {
  let removedLog = null;

  await db.transaction(async (tx) => {
    // Get the objective and verify ownership
    const targetObjective = await getUserObjective(tx, objectiveId, userId);
    if (!targetObjective) {
      throw new Error('Objective not found');
    }

    // Find the most recent log
    const lastLog = await getMostRecentObjectiveLog(tx, objectiveId, userId);
    if (!lastLog) {
      throw new Error('No logs found to undo');
    }
    removedLog = lastLog;

    // Delete the log entry
    await tx.delete(table.objectiveLog).where(eq(table.objectiveLog.id, lastLog.id));

    // Update the objective's current value
    const newValue = Math.max(0, targetObjective.value - lastLog.value);
    await updateObjectiveValue(tx, objectiveId, newValue);

    // Update all widget metrics for this objective
    await updateObjectiveWidgetMetrics(tx, objectiveId);
  });

  return removedLog;
}
