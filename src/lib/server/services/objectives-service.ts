import type { DBType } from '../db';
import * as table from '../db/schema';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { wrapResultAsync, wrapResultAsyncFn, DrizzleRecordNotFoundErrorCause } from '../db/types';
import type { WidgetsService } from './widgets-service';
import type { CacheService } from '../cache';
import type { MetricsService } from './metrics-service';
import type { FormSchema } from '$lib/components/forms/objective-form/schema';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import { ResultAsync } from 'neverthrow';

export class ObjectivesService {
  constructor(
    private readonly db: DBType,
    private readonly widgetService: WidgetsService,
    private readonly metricsService: MetricsService
  ) {}

  public getUserObjectives(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objective)
        .where(eq(table.objective.userId, userId))
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getUserActiveObjectives(userId: string) {
    return wrapResultAsync(
      this.db
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
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getUserCompletedObjectives(userId: string) {
    return wrapResultAsync(
      this.db
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
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getUserArchivedObjectives(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objective)
        .where(and(eq(table.objective.userId, userId), eq(table.objective.archived, true)))
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getUserObjective(objectiveId: string, userId: string) {
    return wrapResultAsyncFn(async () => {
      const objectives = await this.db
        .select()
        .from(table.objective)
        .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)))
        .limit(1);

      if (objectives.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('Objective not found');
      }
      return objectives[0];
    });
  }

  public updateObjectiveWidgetMetrics(objectiveId: string, cache: CacheService) {
    return this.widgetService.getWidgetsFromObjectiveId(objectiveId).andThen((widgets) =>
      ResultAsync.combine(
        widgets.map((widget) =>
          this.metricsService.getMetricsFromWidgetId(widget.id).andThen((metrics) => {
            const objectiveMetrics = metrics.filter((metric) => metric.objectiveId === objectiveId);
            if (objectiveMetrics.length === 0)
              return ResultAsync.fromPromise(Promise.resolve([]), (e) => e);
            return this.metricsService.updateMetricValues(objectiveMetrics, cache);
          })
        )
      )
    );
  }

  public updateObjectiveValue(objectiveId: string, value: number) {
    return wrapResultAsyncFn(async () => {
      return (
        await this.db
          .update(table.objective)
          .set({ value })
          .where(eq(table.objective.id, objectiveId))
          .returning()
      )[0];
    });
  }

  public toggleArchivedObjective(objectiveId: string, userId: string) {
    return this.getUserObjective(objectiveId, userId).andThen((objective) =>
      wrapResultAsync(
        this.db
          .update(table.objective)
          .set({ archived: !objective.archived })
          .where(eq(table.objective.id, objectiveId))
      )
    );
  }

  public createUserObjective(objectiveData: z.infer<FormSchema>, userId: string) {
    return wrapResultAsyncFn(async () => {
      const objectiveId = uuidv4();
      const batchRes = await this.db.batch([
        this.db
          .insert(table.objective)
          .values({
            id: objectiveId,
            name: objectiveData.name,
            description: objectiveData.description,
            startValue: objectiveData.startValue,
            value: objectiveData.startValue,
            unit: objectiveData.unit,
            goalType: objectiveData.goalType,
            endValue: objectiveData.endValue,
            userId,
          })
          .returning(),
        this.db.insert(table.objectiveLog).values({
          id: uuidv4(),
          value: objectiveData.startValue,
          notes: '',
          loggedAt: new Date(),
          objectiveId,
          userId,
        }),
      ]);

      return batchRes[0][0];
    });
  }

  public updateUserObjective(
    objectiveId: string,
    objectiveData: z.infer<FormSchema>,
    userId: string
  ) {
    return this.getUserObjective(objectiveId, userId).andThen(() =>
      wrapResultAsync(
        this.db
          .update(table.objective)
          .set({
            name: objectiveData.name,
            description: objectiveData.description,
            unit: objectiveData.unit,
            goalType: objectiveData.goalType,
            endValue: objectiveData.endValue,
          })
          .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)))
      )
    );
  }

  public deleteUserObjective(objectiveId: string, userId: string) {
    return this.getUserObjective(objectiveId, userId).andThen(() =>
      wrapResultAsync(
        this.db
          .delete(table.objective)
          .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)))
      )
    );
  }
}
