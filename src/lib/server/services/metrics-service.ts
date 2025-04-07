import type { DBType } from '../db';
import * as table from '../db/schema';
import { eq } from 'drizzle-orm';
import { wrapResultAsync } from '../db/types';

export class MetricsService {
  constructor(private readonly db: DBType) {}

  public getAll(widgetId: string) {
    return wrapResultAsync(
      this.db.select().from(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId))
    );
  }
}
