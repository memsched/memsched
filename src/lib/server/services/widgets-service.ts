import * as table from '../db/schema';
import type { WidgetJoinMetrics } from '../db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import { type FormSchema } from '$lib/components/forms/widget-form/schema';
import type { DBType } from '../db';
import type { CacheService } from '../cache';
import { DrizzleRecordNotFoundErrorCause, wrapResultAsync, wrapResultAsyncFn } from '../db/types';
import type { ObjectivesService } from './objectives-service';
import type { MetricsService } from './metrics-service';

export class WidgetsService {
  constructor(
    private readonly db: DBType,
    private objectivesService: ObjectivesService | null = null,
    private readonly metricsService: MetricsService
  ) {}

  public setObjectivesService(service: ObjectivesService) {
    this.objectivesService = service;
  }

  private getObjectivesService() {
    if (!this.objectivesService) {
      throw new Error('ObjectivesService not initialized');
    }
    return this.objectivesService;
  }

  public getUserWidgets(userId: string, completed: boolean = false) {
    return wrapResultAsyncFn(async () => {
      const conditions = eq(table.widget.userId, userId);

      if (completed) {
        // Get completed widgets (associated with completed fixed objectives)
        return await this.db
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
        return await this.db
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
    });
  }

  public getUserPublicWidgetIds(userId: string) {
    return wrapResultAsyncFn(async () => {
      const widgets = await this.db
        .select({ id: table.widget.id })
        .from(table.widget)
        .innerJoin(table.objective, eq(table.widget.objectiveId, table.objective.id))
        .where(and(eq(table.widget.userId, userId), eq(table.objective.visibility, 'public')))
        .orderBy(desc(table.widget.createdAt));

      return widgets.map(({ id }) => id);
    });
  }

  public getWidgetsFromObjectiveId(objectiveId: string) {
    return wrapResultAsync(
      this.db.select().from(table.widget).where(eq(table.widget.objectiveId, objectiveId))
    );
  }

  public getWidgetWithMetrics(widgetId: string, userId?: string) {
    return wrapResultAsyncFn(async () => {
      const widgetWithMetrics = await this.db
        .select({
          widget: table.widget,
          widgetMetric: table.widgetMetric,
        })
        .from(table.widget)
        .leftJoin(table.widgetMetric, eq(table.widget.id, table.widgetMetric.widgetId))
        .where(eq(table.widget.id, widgetId));

      if (
        widgetWithMetrics.length === 0 ||
        (userId && widgetWithMetrics[0].widget.userId !== userId)
      ) {
        throw new DrizzleRecordNotFoundErrorCause('Widget not found');
      }

      const widgetData = widgetWithMetrics[0].widget;
      const metrics = widgetWithMetrics.map(({ widgetMetric }) => widgetMetric).filter(Boolean);

      return { ...widgetData, metrics } as WidgetJoinMetrics;
    });
  }

  public getUserWidget(widgetId: string, userId: string) {
    return wrapResultAsyncFn(async () => {
      const widgets = await this.db
        .select()
        .from(table.widget)
        .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

      if (widgets.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('Widget not found');
      }
      return widgets[0];
    });
  }

  public createUserWidget(widgetData: z.infer<FormSchema>, userId: string) {
    return this.getObjectivesService()
      .getUserObjective(widgetData.objectiveId, userId)
      .andThen((objective) =>
        wrapResultAsyncFn(async () => {
          const widgetId = uuidv4();

          // Create the metrics to insert
          const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
          for (let i = 0; i < widgetData.metrics.length; i++) {
            const metric = widgetData.metrics[i];
            const metricValue = await this.metricsService.computeMetricValue(
              objective.id,
              metric.calculationType,
              metric.valueDecimalPrecision
            );
            if (metricValue.isErr()) {
              throw metricValue.error;
            }

            metricInserts.push({
              id: uuidv4(),
              value: metricValue.value,
              name: metric.name,
              calculationType: metric.calculationType,
              valueDecimalPrecision: metric.valueDecimalPrecision,
              order: i,
              widgetId,
              userId,
            });
          }

          const widgetInsert: Omit<table.Widget, 'createdAt'> = {
            id: widgetId,
            title: widgetData.title,
            subtitle: widgetData.subtitle,
            imageUrl: widgetData.imageUrl,
            imagePlacement: widgetData.imagePlacement,
            textIcon: widgetData.textIcon,

            padding: widgetData.padding,
            border: widgetData.border,
            borderWidth: 1,
            borderRadius: widgetData.borderRadius,
            color: widgetData.color,
            accentColor: widgetData.accentColor,
            backgroundColor: widgetData.backgroundColor,
            watermark: true, // TODO: Default to true, update when user has pro plan

            objectiveId: widgetData.objectiveId,
            userId,
          };

          if (metricInserts.length > 0) {
            await this.db.batch([
              this.db.insert(table.widget).values(widgetInsert),
              this.db.insert(table.widgetMetric).values(metricInserts),
            ]);
          } else {
            await this.db.batch([this.db.insert(table.widget).values(widgetInsert)]);
          }

          return widgetId;
        })
      );
  }

  public updateUserWidget(
    widgetId: string,
    widgetData: z.infer<FormSchema>,
    userId: string,
    cache: CacheService
  ) {
    return this.getUserWidget(widgetId, userId)
      .andThen(() => this.getObjectivesService().getUserObjective(widgetData.objectiveId, userId))
      .andThen((objective) =>
        wrapResultAsyncFn(async () => {
          // Create the metrics to insert
          const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
          for (let i = 0; i < widgetData.metrics.length; i++) {
            const metric = widgetData.metrics[i];
            const metricValue = await this.metricsService.computeMetricValue(
              objective.id,
              metric.calculationType,
              metric.valueDecimalPrecision
            );
            if (metricValue.isErr()) {
              throw metricValue.error;
            }

            metricInserts.push({
              id: uuidv4(),
              value: metricValue.value,
              name: metric.name,
              calculationType: metric.calculationType,
              valueDecimalPrecision: metric.valueDecimalPrecision,
              order: i,
              widgetId,
              userId,
            });
          }

          const widgetUpdate: Omit<table.Widget, 'id' | 'watermark' | 'userId' | 'createdAt'> = {
            title: widgetData.title,
            subtitle: widgetData.subtitle,
            imageUrl: widgetData.imageUrl,
            imagePlacement: widgetData.imagePlacement,
            textIcon: widgetData.textIcon,

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
          };

          if (metricInserts.length > 0) {
            await this.db.batch([
              this.db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId)),
              // Delete all existing metrics
              this.db.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId)),
              // Insert new metrics
              this.db.insert(table.widgetMetric).values(metricInserts),
            ]);
          } else {
            await this.db.batch([
              this.db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId)),
              // Delete all existing metrics
              this.db.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId)),
            ]);
          }

          // Invalidate the widget cache
          await Promise.all([
            cache.delete(`widget:${widgetId}:html`),
            cache.delete(`widget:${widgetId}:svg`),
          ]);
        })
      );
  }

  public deleteUserWidget(widgetId: string, userId: string, cache: CacheService) {
    return this.getUserWidget(widgetId, userId).andThen(() =>
      wrapResultAsyncFn(async () => {
        await this.db
          .delete(table.widget)
          .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

        // Invalidate the widget cache
        await Promise.all([
          cache.delete(`widget:${widgetId}:html`),
          cache.delete(`widget:${widgetId}:svg`),
        ]);
      })
    );
  }

  public getUserWidgetCount(userId: string) {
    return wrapResultAsyncFn(async () => {
      const [count] = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(table.widget)
        .where(eq(table.widget.userId, userId));

      return count.count;
    });
  }
}
