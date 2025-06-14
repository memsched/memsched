import { and, desc, eq, sql } from 'drizzle-orm';
import { okAsync, ResultAsync } from 'neverthrow';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import {
  type FormSchema,
  HEATMAP_CONFIGURATION,
  PLOT_CONFIGURATION,
  VALUE_CONFIGURATION,
} from '$lib/components/forms/widget-form/schema';

import type { CacheService } from '../cache';
import type { DBType } from '../db';
import type { WidgetJoinMetrics } from '../db/schema';
import * as table from '../db/schema';
import {
  type DrizzleError,
  DrizzleRecordNotFoundErrorCause,
  wrapResultAsync,
  wrapResultAsyncFn,
} from '../db/types';
import { stringToEtag } from '../utils';
import { MetricDataService } from './metrics/data/metric-data-service';
import type { WidgetJoinMetricsData } from './metrics/types';
import type { ObjectivesService } from './objectives-service';

export class WidgetsService {
  constructor(
    private readonly db: DBType,
    private readonly objectivesService: ObjectivesService,
    private readonly metricDataService: MetricDataService
  ) {}

  public get(widgetId: string, userId?: string) {
    return wrapResultAsyncFn(async () => {
      const widgets = await this.db
        .select()
        .from(table.widget)
        .where(and(eq(table.widget.id, widgetId)));

      if (widgets.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('Widget not found');
      }
      const widget = widgets[0];
      if (widget.visibility !== 'public' && (!userId || widget.userId !== userId)) {
        throw new DrizzleRecordNotFoundErrorCause('Widget not found');
      }
      return widget;
    });
  }

  public getPublic(widgetId: string) {
    return wrapResultAsyncFn(async () => {
      const widgets = await this.db
        .select()
        .from(table.widget)
        .where(and(eq(table.widget.id, widgetId), eq(table.widget.visibility, 'public')));

      return widgets.length > 0 ? widgets[0] : null;
    });
  }

  public getAll(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.widget)
        .where(eq(table.widget.userId, userId))
        .orderBy(desc(table.widget.createdAt))
    );
  }

  public getAllPublic(userId: string) {
    return wrapResultAsync(
      this.db
        .select({ id: table.widget.id })
        .from(table.widget)
        .where(and(eq(table.widget.userId, userId), eq(table.widget.visibility, 'public')))
        .orderBy(desc(table.widget.createdAt))
    );
  }

  public getAllByObjectiveId(objectiveId: string) {
    return wrapResultAsyncFn(async () => {
      const widgets = await this.db
        .select({ widget: table.widget })
        .from(table.widget)
        .leftJoin(table.widgetMetric, eq(table.widget.id, table.widgetMetric.widgetId))
        .where(eq(table.widgetMetric.objectiveId, objectiveId));

      return widgets.map((widget) => widget.widget);
    });
  }

  public getWithMetrics(widgetId: string, userId?: string) {
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

      const widget = widgetWithMetrics[0].widget;
      const metrics = widgetWithMetrics
        .map((row) => row.widgetMetric)
        .filter((metric) => metric !== null);

      return { ...widget, metrics } as WidgetJoinMetrics;
    });
  }

  public getWithMetricsData(widgetId: string, userId?: string) {
    return this.getWithMetrics(widgetId, userId).andThen((widget) =>
      ResultAsync.combine([
        okAsync(widget),
        ...widget.metrics.map((metric) => this.metricDataService.getData(metric)),
      ]).andThen(([widget, ...metricDatas]) =>
        okAsync({
          ...widget,
          metrics: widget.metrics.map((metric, i) => ({
            ...metric,
            data: metricDatas[i],
          })),
        } as WidgetJoinMetricsData)
      )
    ) as ResultAsync<WidgetJoinMetricsData, DrizzleError>;
  }

  public generateEtag(widget: WidgetJoinMetricsData) {
    const widgetData = JSON.stringify({
      ...widget,
      metrics: widget.metrics.sort((a, b) => a.order - b.order),
    });
    return stringToEtag(widgetData);
  }

  public create(widgetData: z.infer<FormSchema>, userId: string) {
    return wrapResultAsyncFn(async () => {
      const widgetId = uuidv4();

      // Create the metrics to insert
      const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
      for (let i = 0; i < widgetData.metrics.length; i++) {
        const metric = widgetData.metrics[i];

        if (metric.provider === 'objective') {
          // Handle objective metrics
          // Verify the user has access to the objective
          const objectiveResult = await this.objectivesService.get(metric.objectiveId, userId);

          if (objectiveResult.isErr()) {
            throw objectiveResult.error;
          }
        }
        // TODO(METRICS): Maybe compute the metric and cache it here?
        const hasValue = VALUE_CONFIGURATION.includes(metric.style);
        const hasPlot = PLOT_CONFIGURATION.includes(metric.style);
        const hasHeatmap = HEATMAP_CONFIGURATION.includes(metric.style);

        metricInserts.push({
          id: uuidv4(),
          order: i,

          style: metric.style,
          valueName: hasValue ? metric.valueName : null,
          valuePeriod: hasValue ? metric.valuePeriod : null,
          valueDisplayPrecision: hasValue ? metric.valueDisplayPrecision : null,
          valuePercent: hasValue ? metric.valuePercent : null,
          plotPeriod: hasPlot ? metric.plotPeriod : null,
          plotInterval: hasPlot ? metric.plotInterval : null,
          heatmapPeriod: hasHeatmap ? metric.heatmapPeriod : null,
          heatmapInterval: hasHeatmap ? metric.heatmapInterval : null,

          provider: metric.provider,
          objectiveId: metric.provider === 'objective' ? metric.objectiveId : null,
          githubUsername: metric.provider === 'github' ? metric.githubUsername : null,
          githubStatType: metric.provider === 'github' ? metric.githubStatType || 'commits' : null,

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
        borderWidth: widgetData.borderWidth,
        borderRadius: widgetData.borderRadius,
        borderColor: widgetData.borderColor,
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

  public update(
    widgetId: string,
    widgetData: z.infer<FormSchema>,
    userId: string,
    cache: CacheService
  ) {
    return this.get(widgetId, userId).andThen(() =>
      wrapResultAsyncFn(async () => {
        // Delete all current metrics - we'll re-create them
        await this.db.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId));

        // Create the metrics to insert
        const metricInserts: Omit<table.WidgetMetric, 'createdAt'>[] = [];
        for (let i = 0; i < widgetData.metrics.length; i++) {
          const metric = widgetData.metrics[i];

          if (metric.provider === 'objective') {
            // Handle objective metrics
            // Verify the user has access to the objective
            const objectiveResult = await this.objectivesService.get(metric.objectiveId, userId);

            if (objectiveResult.isErr()) {
              throw objectiveResult.error;
            }
          }
          // TODO(METRICS): Maybe compute the metric and cache it here?

          const hasValue = VALUE_CONFIGURATION.includes(metric.style);
          const hasPlot = PLOT_CONFIGURATION.includes(metric.style);
          const hasHeatmap = HEATMAP_CONFIGURATION.includes(metric.style);

          metricInserts.push({
            id: uuidv4(),
            order: i,

            style: metric.style,
            valueName: hasValue ? metric.valueName : null,
            valuePeriod: hasValue ? metric.valuePeriod : null,
            valueDisplayPrecision: hasValue ? metric.valueDisplayPrecision : null,
            valuePercent: hasValue ? metric.valuePercent : null,
            plotPeriod: hasPlot ? metric.plotPeriod : null,
            plotInterval: hasPlot ? metric.plotInterval : null,
            heatmapPeriod: hasHeatmap ? metric.heatmapPeriod : null,
            heatmapInterval: hasHeatmap ? metric.heatmapInterval : null,

            provider: metric.provider,
            objectiveId: metric.provider === 'objective' ? metric.objectiveId : null,
            githubUsername: metric.provider === 'github' ? metric.githubUsername : null,
            githubStatType:
              metric.provider === 'github' ? metric.githubStatType || 'commits' : null,

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
          borderWidth: widgetData.borderWidth,
          borderRadius: widgetData.borderRadius,
          borderColor: widgetData.borderColor,
          color: widgetData.color,
          accentColor: widgetData.accentColor,
          backgroundColor: widgetData.backgroundColor,
          watermark: widgetData.watermark,

          userId,
        };

        // Update in DB (batch so we handle the case where there are no metrics)
        if (metricInserts.length > 0) {
          await this.db.batch([
            this.db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId)),
            this.db.insert(table.widgetMetric).values(metricInserts),
          ]);
        } else {
          await this.db.update(table.widget).set(widgetUpdate).where(eq(table.widget.id, widgetId));
        }

        // Invalidate the cache
        await this.invalidateWidget(widgetId, cache);

        return widgetId;
      })
    );
  }

  public deleteUserWidget(widgetId: string, userId: string, cache: CacheService) {
    return this.get(widgetId, userId).andThen(() =>
      wrapResultAsyncFn(async () => {
        await this.db
          .delete(table.widget)
          .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

        // Invalidate the cache
        await this.invalidateWidget(widgetId, cache);
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

  public invalidateWidget(widgetId: string, cache: CacheService) {
    return wrapResultAsyncFn(async () => {
      await Promise.all(
        ['html', 'svg'].flatMap((format) =>
          ['light', 'dark'].map((theme) => cache.delete(`widget:${widgetId}:${format}:${theme}`))
        )
      );
    });
  }

  public invalidateWidgets(objectiveId: string, cache: CacheService) {
    return this.getAllByObjectiveId(objectiveId).andThen((widgets) =>
      ResultAsync.combine(widgets.map((widget) => this.invalidateWidget(widget.id, cache)))
    );
  }
}
