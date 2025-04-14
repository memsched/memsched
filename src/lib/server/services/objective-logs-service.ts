import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import type { LogSchema } from '$lib/components/forms/objective-log-form/schema';

import type { CacheService } from '../cache';
import type { DBType } from '../db';
import * as table from '../db/schema';
import {
  createDrizzleError,
  DrizzleRecordNotFoundErrorCause,
  wrapResultAsync,
  wrapResultAsyncFn,
} from '../db/types';
import type { MetricsService } from './metrics-service';
import type { ObjectivesService } from './objectives-service';

export class ObjectiveLogsService {
  constructor(
    private readonly db: DBType,
    private readonly objectivesService: ObjectivesService,
    private readonly metricsService: MetricsService
  ) {}

  public getAll(objectiveId: string, userId: string) {
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

  public getCount(
    objectiveId: string,
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    return wrapResultAsyncFn(async () => {
      const result = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId),
            ...(options.startDate ? [gte(table.objectiveLog.loggedAt, options.startDate)] : []),
            ...(options.endDate ? [lte(table.objectiveLog.loggedAt, options.endDate)] : [])
          )
        );
      return result[0]?.count || 0;
    });
  }

  public getSum(
    objectiveId: string,
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    return wrapResultAsyncFn(async () => {
      const result = await this.db
        .select({ sum: sql<number>`SUM(value)` })
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId),
            ...(options.startDate ? [gte(table.objectiveLog.loggedAt, options.startDate)] : []),
            ...(options.endDate ? [lte(table.objectiveLog.loggedAt, options.endDate)] : [])
          )
        );
      return result[0]?.sum || 0;
    });
  }

  public log(
    logData: z.infer<LogSchema>,
    userId: string,
    cache: CacheService,
    referenceDate?: Date
  ) {
    return this.objectivesService
      .get(logData.objectiveId, userId)
      .andThen((objective) => {
        const newValue = objective.value + logData.value;

        return ResultAsync.combine([
          this.objectivesService.updateObjectiveValue(logData.objectiveId, newValue),
          this.create(logData, userId, referenceDate),
        ]);
      })
      .andThen(([objective, log]) =>
        ResultAsync.combine([
          okAsync(objective),
          okAsync(log),
          this.metricsService.invalidateMetrics(objective.id, cache),
        ])
      );
  }

  public undoLog(objectiveId: string, userId: string, cache: CacheService) {
    return this.objectivesService
      .get(objectiveId, userId)
      .andThen((objective) =>
        ResultAsync.combine([okAsync(objective), this.getMostRecent(objectiveId, userId)])
      )
      .andThen(([objective, lastLog]) => {
        if (!lastLog) {
          return errAsync(
            createDrizzleError(new DrizzleRecordNotFoundErrorCause('No logs found to undo'))
          );
        }
        const newValue = Math.max(0, objective.value - lastLog.value);
        return ResultAsync.combine([
          this.objectivesService.updateObjectiveValue(objectiveId, newValue),
          okAsync(lastLog),
          this.delete(lastLog.id),
        ]);
      })
      .andThen(([updatedObjective, lastLog]) => {
        return ResultAsync.combine([
          okAsync(updatedObjective),
          okAsync(lastLog),
          this.metricsService.invalidateMetrics(updatedObjective.id, cache),
        ]);
      });
  }

  private getMostRecent(objectiveId: string, userId: string) {
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

  private create(logData: z.infer<LogSchema>, userId: string, referenceDate?: Date) {
    return wrapResultAsync(
      this.db.insert(table.objectiveLog).values({
        id: uuidv4(),
        value: logData.value,
        notes: logData.notes || null,
        loggedAt: referenceDate ?? new Date(),
        objectiveId: logData.objectiveId,
        userId,
      })
    );
  }

  private delete(logId: string) {
    return wrapResultAsync(
      this.db.delete(table.objectiveLog).where(eq(table.objectiveLog.id, logId))
    );
  }

  public getRunningLogPoints(
    objectiveId: string,
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const dateExpr = sql`date(datetime(${table.objectiveLog.loggedAt}, 'unixepoch'))`;

    return wrapResultAsync(
      this.db
        .select({
          date: dateExpr,
          value: sql<number>`SUM(SUM(${table.objectiveLog.value})) OVER (ORDER BY ${dateExpr})`,
        })
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId),
            ...(options.startDate ? [gte(table.objectiveLog.loggedAt, options.startDate)] : []),
            ...(options.endDate ? [lte(table.objectiveLog.loggedAt, options.endDate)] : [])
          )
        )
        .groupBy(dateExpr)
        .orderBy(dateExpr)
    );
  }

  public getDailyLogPoints(
    objectiveId: string,
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const dateExpr = sql`date(datetime(${table.objectiveLog.loggedAt}, 'unixepoch'))`;

    return wrapResultAsync(
      this.db
        .select({
          date: dateExpr,
          value: sql<number>`SUM(${table.objectiveLog.value})`,
        })
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId),
            ...(options.startDate ? [gte(table.objectiveLog.loggedAt, options.startDate)] : []),
            ...(options.endDate ? [lte(table.objectiveLog.loggedAt, options.endDate)] : [])
          )
        )
        .groupBy(dateExpr)
        .orderBy(dateExpr)
    );
  }

  public getWeeklyLogPoints(
    objectiveId: string,
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const weekExpr = sql`strftime('%Y-%W', datetime(${table.objectiveLog.loggedAt}, 'unixepoch'))`;

    return wrapResultAsync(
      this.db
        .select({
          date: weekExpr,
          value: sql<number>`SUM(SUM(${table.objectiveLog.value})) OVER (ORDER BY ${weekExpr})`,
        })
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId),
            ...(options.startDate ? [gte(table.objectiveLog.loggedAt, options.startDate)] : []),
            ...(options.endDate ? [lte(table.objectiveLog.loggedAt, options.endDate)] : [])
          )
        )
        .groupBy(weekExpr)
        .orderBy(weekExpr)
    );
  }

  public getMonthlyLogPoints(
    objectiveId: string,
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const monthExpr = sql`strftime('%Y-%m', datetime(${table.objectiveLog.loggedAt}, 'unixepoch'))`;

    return wrapResultAsync(
      this.db
        .select({
          date: monthExpr,
          value: sql<number>`SUM(SUM(${table.objectiveLog.value})) OVER (ORDER BY ${monthExpr})`,
        })
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, objectiveId),
            eq(table.objectiveLog.userId, userId),
            ...(options.startDate ? [gte(table.objectiveLog.loggedAt, options.startDate)] : []),
            ...(options.endDate ? [lte(table.objectiveLog.loggedAt, options.endDate)] : [])
          )
        )
        .groupBy(monthExpr)
        .orderBy(monthExpr)
    );
  }
}
