import * as table from '../db/schema';
import { db } from '../db';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import type { LogSchema } from '$lib/components/forms/objective-log-form/schema';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ResultSet } from '@libsql/client';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import {
  getUserObjective,
  updateObjectiveValue,
  updateObjectiveWidgetMetrics,
} from './objective-queries';
import type { Objective } from '../db/schema';

/**
 * Gets logs for a specific objective
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns Logs for the objective
 */
export async function getObjectiveLogs(objectiveId: string, userId: string) {
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
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns The most recent log, or null if no logs exist
 */
export async function getMostRecentObjectiveLog(
  objectiveId: string,
  userId: string,
  tx?: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) {
  const logs = await (tx ?? db)
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
 * @param logData Log data
 * @param userId The user ID
 * @returns The objective after update, or null if objective not found
 */
export async function logObjectiveProgress(logData: z.infer<LogSchema>, userId: string) {
  let updatedObjective = null;

  await db.transaction(async (tx) => {
    // Get the objective and verify ownership
    const targetObjective = await getUserObjective(logData.objectiveId, userId, tx);
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
    updatedObjective = await updateObjectiveValue(logData.objectiveId, newValue, tx);

    // Update all widget metrics for this objective
    await updateObjectiveWidgetMetrics(tx, logData.objectiveId);
  });

  return updatedObjective as Objective | null;
}

/**
 * Undoes (removes) the most recent log entry for an objective
 * @param objectiveId The objective ID
 * @param userId The user ID
 * @returns The removed log or null if no logs exist
 */
export async function undoObjectiveLog(objectiveId: string, userId: string) {
  let removedLog = null;

  await db.transaction(async (tx) => {
    // Get the objective and verify ownership
    const targetObjective = await getUserObjective(objectiveId, userId, tx);
    if (!targetObjective) {
      throw new Error('Objective not found');
    }

    // Find the most recent log
    const lastLog = await getMostRecentObjectiveLog(objectiveId, userId, tx);
    if (!lastLog) {
      throw new Error('No logs found to undo');
    }
    removedLog = lastLog;

    // Delete the log entry
    await tx.delete(table.objectiveLog).where(eq(table.objectiveLog.id, lastLog.id));

    // Update the objective's current value
    const newValue = Math.max(0, targetObjective.value - lastLog.value);
    await updateObjectiveValue(objectiveId, newValue, tx);

    // Update all widget metrics for this objective
    await updateObjectiveWidgetMetrics(tx, objectiveId);
  });

  return removedLog;
}
