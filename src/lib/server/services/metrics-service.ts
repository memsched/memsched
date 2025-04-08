import { eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { CacheService } from '../cache';
import type { DBType } from '../db';
import * as table from '../db/schema';
import { wrapResultAsync, wrapResultAsyncFn } from '../db/types';

export class MetricsService {
  constructor(private readonly db: DBType) {}

  public getAll(widgetId: string) {
    return wrapResultAsync(
      this.db.select().from(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId))
    );
  }

  public getAllByObjectiveId(objectiveId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.widgetMetric)
        .where(eq(table.widgetMetric.objectiveId, objectiveId))
    );
  }

  public invalidateMetrics(objectiveId: string, cache: CacheService) {
    return this.getAllByObjectiveId(objectiveId).andThen((metrics) =>
      ResultAsync.combine(
        metrics.map((metric) =>
          wrapResultAsyncFn(async () => {
            await Promise.all([
              cache.delete(`metric:${metric.id}:html`),
              cache.delete(`metric:${metric.id}:svg`),
            ]);
          })
        )
      )
    );
  }
}
