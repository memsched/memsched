import type { DBType } from '../db';
import * as table from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { DrizzleRecordNotFoundErrorCause, wrapResultAsync, wrapResultAsyncFn } from '../db/types';
import type { LogSchema } from '$lib/components/forms/objective-log-form/schema';
import type { CacheService } from '../cache';
import { z } from 'zod';
import type { ObjectivesService } from './objectives-service';
import { v4 as uuidv4 } from 'uuid';
import { okAsync, ResultAsync } from 'neverthrow';

export class ObjectiveLogsService {
  constructor(
    private readonly db: DBType,
    private readonly objectivesService: ObjectivesService
  ) {}

  public getObjectiveLogs(objectiveId: string, userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId)
          )
        )
        .orderBy(desc(table.objectiveLog.loggedAt))
    );
  }

  public getMostRecentObjectiveLog(objectiveId: string, userId: string) {
    return wrapResultAsyncFn(async () => {
      const logs = await this.db
        .select()
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId)
          )
        )
        .orderBy(desc(table.objectiveLog.loggedAt))
        .limit(1);

      return logs.length > 0 ? logs[0] : null;
    });
  }

  public logObjectiveProgress(logData: z.infer<LogSchema>, userId: string, cache: CacheService) {
    return this.objectivesService
      .getUserObjective(logData.objectiveId, userId)
      .andThen((objective) => {
        const newValue = objective.value + logData.value;

        return ResultAsync.combine([
          this.objectivesService.updateObjectiveValue(logData.objectiveId, newValue),
          this.createObjectiveLog(logData, userId),
        ]);
      })
      .andThen(([objective, log]) =>
        ResultAsync.combine([
          okAsync(objective),
          okAsync(log),
          this.objectivesService.updateObjectiveWidgetMetrics(logData.objectiveId, cache),
        ])
      );
  }

  public undoObjectiveLog(objectiveId: string, userId: string, cache: CacheService) {
    return this.objectivesService
      .getUserObjective(objectiveId, userId)
      .andThen((objective) =>
        ResultAsync.combine([
          okAsync(objective),
          this.getMostRecentObjectiveLog(objectiveId, userId),
        ])
      )
      .andThen(([objective, lastLog]) => {
        if (!lastLog) {
          throw new DrizzleRecordNotFoundErrorCause('No logs found to undo');
        }
        const newValue = Math.max(0, objective.value - lastLog.value);
        return ResultAsync.combine([
          okAsync(objective),
          okAsync(lastLog),
          this.deleteObjectiveLog(lastLog.id),
          this.objectivesService.updateObjectiveValue(objectiveId, newValue),
        ]);
      })
      .andThen(([objective, lastLog]) =>
        ResultAsync.combine([
          okAsync(objective),
          okAsync(lastLog),
          this.objectivesService.updateObjectiveWidgetMetrics(objectiveId, cache),
        ])
      );
  }

  private createObjectiveLog(logData: z.infer<LogSchema>, userId: string) {
    return wrapResultAsync(
      this.db.insert(table.objectiveLog).values({
        id: uuidv4(),
        value: logData.value,
        notes: logData.notes || null,
        loggedAt: new Date(),
        objectiveId: logData.objectiveId,
        userId,
      })
    );
  }

  private deleteObjectiveLog(logId: string) {
    return wrapResultAsync(
      this.db.delete(table.objectiveLog).where(eq(table.objectiveLog.id, logId))
    );
  }
}
