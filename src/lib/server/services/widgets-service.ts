import * as table from '../db/schema';
import type { WidgetJoinMetrics } from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import { type FormSchema } from '$lib/components/forms/widget-form/schema';
import type { DBType } from '../db';
import type { CacheService } from '../cache';
import { DrizzleRecordNotFoundErrorCause, wrapResultAsyncFn } from '../db/types';
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

  public getUserWidgets(userId: string) {
    return wrapResultAsyncFn(async () => {
      // Get all user widgets
      const widgets = await this.db
        .select()
        .from(table.widget)
        .where(eq(table.widget.userId, userId))
        .orderBy(desc(table.widget.createdAt));

      // No need to filter by objective completion status anymore
      // Each widget can have metrics from multiple objectives
      return widgets.map((widget) => ({ id: widget.id }));
    });
  }

  public getUserPublicWidgetIds(userId: string) {
    return wrapResultAsyncFn(async () => {
      // Get widgets that are public
      const widgets = await this.db
        .select({ id: table.widget.id })
        .from(table.widget)
        .where(and(eq(table.widget.userId, userId), eq(table.widget.visibility, 'public')))
        .orderBy(desc(table.widget.createdAt));

      return widgets.map(({ id }) => id);
    });
  }

  public getWidgetsFromObjectiveId(objectiveId: string) {
    return wrapResultAsyncFn(async () => {
      // Find widgets that have metrics referencing this objective
      const widgets = await this.db
        .select({ widget: table.widget })
        .from(table.widgetMetric)
        .innerJoin(table.widget, eq(table.widgetMetric.widgetId, table.widget.id))
        .where(eq(table.widgetMetric.objectiveId, objectiveId))
        .groupBy(table.widget.id);

      return widgets.map(({ widget }) => widget);
    });
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
    return wrapResultAsyncFn(async () => {
      const widgetId = uuidv4();

      // Create the metrics to insert
      const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
      for (let i = 0; i < widgetData.metrics.length; i++) {
        const metric = widgetData.metrics[i];

        if (metric.metricType === 'objective') {
          // Handle objective metrics
          // Verify the user has access to the objective
          const objectiveResult = await this.getObjectivesService().getUserObjective(
            metric.objectiveId,
            userId
          );

          if (objectiveResult.isErr()) {
            throw objectiveResult.error;
          }
        }

        // Create a correctly typed metric object for the service call
        const metricPayload = {
          metricType: metric.metricType,
          objectiveId: metric.objectiveId ?? null,
          calculationType: metric.calculationType,
          valueDecimalPrecision: metric.valueDecimalPrecision,
          githubUsername: metric.githubUsername ?? null,
          githubStatType: metric.githubStatType ?? 'commits',
        };

        // Compute metric value using the MetricsService
        const metricValueResult = await this.metricsService.computeMetricValue(
          metricPayload.metricType,
          metricPayload.objectiveId,
          metricPayload.calculationType,
          metricPayload.valueDecimalPrecision,
          metricPayload.githubUsername,
          metricPayload.githubStatType
        );

        if (metricValueResult.isErr()) {
          throw metricValueResult.error;
        }

        metricInserts.push({
          id: uuidv4(),
          value: metricValueResult.value,
          name: metric.name,
          calculationType: metric.calculationType,
          valueDecimalPrecision: metric.valueDecimalPrecision,
          metricType: metric.metricType,
          order: i,
          objectiveId: metric.metricType === 'objective' ? metric.objectiveId : null,
          githubUsername: metric.metricType === 'github' ? metric.githubUsername : null,
          githubStatType:
            metric.metricType === 'github' ? metric.githubStatType || 'commits' : null,
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
        visibility: widgetData.visibility,

        padding: widgetData.padding,
        border: widgetData.border,
        borderWidth: widgetData.borderWidth,
        borderRadius: widgetData.borderRadius,
        color: widgetData.color,
        accentColor: widgetData.accentColor,
        backgroundColor: widgetData.backgroundColor,
        watermark: widgetData.watermark,

        userId,
      };

      if (metricInserts.length > 0) {
        await this.db.batch([
          this.db.insert(table.widget).values(widgetInsert),
          this.db.insert(table.widgetMetric).values(metricInserts),
        ]);
      } else {
        await this.db.insert(table.widget).values(widgetInsert);
      }

      return widgetId;
    });
  }

  public updateUserWidget(
    widgetId: string,
    widgetData: z.infer<FormSchema>,
    userId: string,
    cache: CacheService
  ) {
    return this.getUserWidget(widgetId, userId).andThen(() =>
      wrapResultAsyncFn(async () => {
        // Delete all current metrics - we'll re-create them
        await this.db.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId));

        // Create the metrics to insert
        const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
        for (let i = 0; i < widgetData.metrics.length; i++) {
          const metric = widgetData.metrics[i];

          if (metric.metricType === 'objective') {
            // Handle objective metrics
            // Verify the user has access to the objective
            const objectiveResult = await this.getObjectivesService().getUserObjective(
              metric.objectiveId,
              userId
            );

            if (objectiveResult.isErr()) {
              throw objectiveResult.error;
            }
          }

          // Create a correctly typed metric object for the service call
          const metricPayload = {
            metricType: metric.metricType,
            objectiveId: metric.objectiveId ?? null,
            calculationType: metric.calculationType,
            valueDecimalPrecision: metric.valueDecimalPrecision,
            githubUsername: metric.githubUsername ?? null,
            githubStatType: metric.githubStatType ?? 'commits',
          };

          // Compute metric value using the MetricsService
          const metricValueResult = await this.metricsService.computeMetricValue(
            metricPayload.metricType,
            metricPayload.objectiveId,
            metricPayload.calculationType,
            metricPayload.valueDecimalPrecision,
            metricPayload.githubUsername,
            metricPayload.githubStatType
          );

          if (metricValueResult.isErr()) {
            throw metricValueResult.error;
          }

          metricInserts.push({
            id: uuidv4(),
            value: metricValueResult.value,
            name: metric.name,
            calculationType: metric.calculationType,
            valueDecimalPrecision: metric.valueDecimalPrecision,
            metricType: metric.metricType,
            order: i,
            objectiveId: metric.metricType === 'objective' ? metric.objectiveId : null,
            githubUsername: metric.metricType === 'github' ? metric.githubUsername : null,
            githubStatType:
              metric.metricType === 'github' ? metric.githubStatType || 'commits' : null,
            widgetId,
            userId,
          });
        }

        const widgetUpdate = {
          id: widgetId,
          title: widgetData.title,
          subtitle: widgetData.subtitle,
          imageUrl: widgetData.imageUrl,
          imagePlacement: widgetData.imagePlacement,
          textIcon: widgetData.textIcon,
          visibility: widgetData.visibility,

          padding: widgetData.padding,
          border: widgetData.border,
          borderWidth: widgetData.borderWidth,
          borderRadius: widgetData.borderRadius,
          color: widgetData.color,
          accentColor: widgetData.accentColor,
          backgroundColor: widgetData.backgroundColor,
          watermark: widgetData.watermark,

          userId,
        };

        // Clear cache
        await cache.delete(`widget:${widgetId}:html`);
        await cache.delete(`widget:${widgetId}:svg`);

        // Update in DB (batch so we handle the case where there are no metrics)
        if (metricInserts.length > 0) {
          await this.db.batch([
            this.db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId)),
            this.db.insert(table.widgetMetric).values(metricInserts),
          ]);
        } else {
          await this.db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId));
        }

        return widgetId;
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
