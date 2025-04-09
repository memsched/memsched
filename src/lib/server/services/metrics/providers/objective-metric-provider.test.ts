import { subDays } from 'date-fns';
import { eq } from 'drizzle-orm';
import { okAsync } from 'neverthrow';
import { beforeEach, describe, expect, it } from 'vitest';

import type { DBType } from '$lib/server/db';
import type { WidgetMetric } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { getTestDB, getTestUsers } from '$lib/server/test-utils/test-context';

import { MetricsService } from '../../metrics-service';
import { ObjectiveLogsService } from '../../objective-logs-service';
import { ObjectivesService } from '../../objectives-service';
import { ObjectiveMetricProvider } from './objective-metric-provider';

describe('ObjectiveMetricProvider', () => {
  let db: DBType;
  let testUsers: table.User[];
  let objectiveMetricProvider: ObjectiveMetricProvider;
  let objectivesService: ObjectivesService;
  let objectiveLogsService: ObjectiveLogsService;
  let metricsService: MetricsService;
  let testObjectiveId: string;

  beforeEach(async () => {
    db = getTestDB();
    testUsers = getTestUsers();

    // Initialize services
    metricsService = {
      invalidateMetrics: () => okAsync(undefined),
    } as unknown as MetricsService;

    objectivesService = new ObjectivesService(db);
    objectiveLogsService = new ObjectiveLogsService(db, objectivesService, metricsService);
    objectiveMetricProvider = new ObjectiveMetricProvider(objectivesService, objectiveLogsService);

    // Create a test objective
    const createResult = await objectivesService.create(
      {
        name: 'Test Objective',
        description: 'Test Description',
        startValue: 0,
        unit: 'other' as const,
        goalType: 'fixed' as const,
        endValue: 100,
      },
      testUsers[0].id
    );

    if (createResult.isErr()) {
      throw createResult.error;
    }

    testObjectiveId = createResult.value.id;

    const today = new Date();
    const yesterday = subDays(today, 1);

    // Add some test logs
    await objectiveLogsService.log(
      {
        objectiveId: testObjectiveId,
        value: 20,
        notes: 'First log',
      },
      testUsers[0].id,
      { del: () => {} } as any
    );

    // Set first log to yesterday
    await db
      .update(table.objectiveLog)
      .set({ loggedAt: yesterday })
      .where(eq(table.objectiveLog.objectiveId, testObjectiveId));

    await objectiveLogsService.log(
      {
        objectiveId: testObjectiveId,
        value: 30,
        notes: 'Second log',
      },
      testUsers[0].id,
      { del: () => {} } as any
    );
  });

  describe('getValueData', () => {
    it('should return current value', async () => {
      const result = await objectiveMetricProvider.getValueData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: 'all time',
        valueDisplayPrecision: 0,
        valuePercent: false,
        plotPeriod: null,
        plotInterval: null,
        widgetId: 'test-widget',
        style: 'metric-base',
        valueName: null,
        heatmapPeriod: null,
        heatmapInterval: null,
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.value).toBe(50); // 20 + 30
    });

    it('should return percentage when valuePercent is true', async () => {
      const result = await objectiveMetricProvider.getValueData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: 'all time',
        valueDisplayPrecision: 0,
        valuePercent: true,
        plotPeriod: null,
        plotInterval: null,
        widgetId: 'test-widget',
        style: 'metric-base',
        valueName: null,
        heatmapPeriod: null,
        heatmapInterval: null,
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.value).toBe(50); // (50/100) * 100
    });

    it('should respect valueDisplayPrecision', async () => {
      const result = await objectiveMetricProvider.getValueData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: 'all time',
        valueDisplayPrecision: 2,
        valuePercent: true,
        plotPeriod: null,
        plotInterval: null,
        widgetId: 'test-widget',
        style: 'metric-base',
        valueName: null,
        heatmapPeriod: null,
        heatmapInterval: null,
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.value).toBe(50.0);
    });

    it('should respect valuePeriod', async () => {
      // Test different periods
      const periods: NonNullable<WidgetMetric['valuePeriod']>[] = ['day', 'week', 'month', 'year'];

      for (const period of periods) {
        const result = await objectiveMetricProvider.getValueData({
          id: 'test',
          createdAt: new Date(),
          userId: testUsers[0].id,
          objectiveId: testObjectiveId,
          order: 0,
          provider: 'objective',
          githubUsername: null,
          githubStatType: null,
          valuePeriod: period,
          valueDisplayPrecision: 0,
          valuePercent: false,
          plotPeriod: null,
          plotInterval: null,
          widgetId: 'test-widget',
          style: 'metric-base',
          valueName: null,
          heatmapPeriod: null,
          heatmapInterval: null,
        });

        expect(result.isOk()).toBe(true);
        if (result.isErr()) return;

        // For our test data:
        // - 'day' should only show today's value (30)
        // - 'week', 'month', 'year' should show both values (50)
        const expectedValue = period === 'day' ? 30 : 50;
        expect(result.value.value).toBe(expectedValue);
      }
    });
  });

  describe('getPlotData', () => {
    it('should return plot points with daily interval', async () => {
      const result = await objectiveMetricProvider.getPlotData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: null,
        valueDisplayPrecision: null,
        valuePercent: null,
        plotPeriod: 'all time',
        plotInterval: 'day',
        widgetId: 'test-widget',
        style: 'plot-base',
        valueName: null,
        heatmapPeriod: null,
        heatmapInterval: null,
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value.points;
      expect(points).toHaveLength(2);
      expect(points[0].y).toBe(20);
      expect(points[1].y).toBe(50);
    });

    it('should return plot points with weekly interval', async () => {
      const result = await objectiveMetricProvider.getPlotData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: null,
        valueDisplayPrecision: null,
        valuePercent: null,
        plotPeriod: 'all time',
        plotInterval: 'week',
        widgetId: 'test-widget',
        style: 'plot-base',
        valueName: null,
        heatmapPeriod: null,
        heatmapInterval: null,
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value.points;
      expect(points).toHaveLength(1); // Both logs are in the same week
      expect(points[0].y).toBe(50);
    });

    it('should respect plotPeriod', async () => {
      // Test different periods from the enum
      const periods: NonNullable<WidgetMetric['plotPeriod']>[] = [
        'week',
        'month',
        'year',
        'all time',
      ];

      for (const period of periods) {
        const result = await objectiveMetricProvider.getPlotData({
          id: 'test',
          createdAt: new Date(),
          userId: testUsers[0].id,
          objectiveId: testObjectiveId,
          order: 0,
          provider: 'objective',
          githubUsername: null,
          githubStatType: null,
          valuePeriod: null,
          valueDisplayPrecision: null,
          valuePercent: null,
          plotPeriod: period,
          plotInterval: 'day',
          widgetId: 'test-widget',
          style: 'plot-base',
          valueName: null,
          heatmapPeriod: null,
          heatmapInterval: null,
        });

        expect(result.isOk()).toBe(true);
        if (result.isErr()) return;

        const points = result.value.points;

        // For our test data:
        // - 'week' should show both values since they're in the same week
        // - 'month' should show both values since they're in the same month
        // - 'year' should show both values since they're in the same year
        // - 'all time' should show both values
        expect(points.length).toBeGreaterThan(0);
        expect(points[points.length - 1].y).toBe(50); // Final cumulative value should be 50
      }
    });
  });

  describe('getHeatmapData', () => {
    it('should return heatmap data for the current month', async () => {
      const result = await objectiveMetricProvider.getHeatmapData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: null,
        valueDisplayPrecision: null,
        valuePercent: null,
        plotPeriod: null,
        plotInterval: null,
        widgetId: 'test-widget',
        style: 'heatmap-base',
        valueName: null,
        heatmapPeriod: 'month',
        heatmapInterval: 'day',
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.cols).toBe(7); // 7 days per week
      expect(result.value.points.length).toBeGreaterThan(0);

      // Find non-zero points (our log entries)
      const nonZeroPoints = result.value.points.filter((p) => p.z > 0);
      expect(nonZeroPoints).toHaveLength(2);
      expect(nonZeroPoints[0].z).toBe(20);
      expect(nonZeroPoints[1].z).toBe(30);
    });

    it('should respect heatmapPeriod', async () => {
      // Test the only valid period from the enum
      const period: NonNullable<WidgetMetric['heatmapPeriod']> = 'month';

      const result = await objectiveMetricProvider.getHeatmapData({
        id: 'test',
        createdAt: new Date(),
        userId: testUsers[0].id,
        objectiveId: testObjectiveId,
        order: 0,
        provider: 'objective',
        githubUsername: null,
        githubStatType: null,
        valuePeriod: null,
        valueDisplayPrecision: null,
        valuePercent: null,
        plotPeriod: null,
        plotInterval: null,
        widgetId: 'test-widget',
        style: 'heatmap-base',
        valueName: null,
        heatmapPeriod: period,
        heatmapInterval: 'day',
      });

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.cols).toBe(7); // 7 days per week
      expect(result.value.points.length).toBeGreaterThan(0);

      // Find non-zero points (our log entries)
      const nonZeroPoints = result.value.points.filter((p) => p.z > 0);
      expect(nonZeroPoints).toHaveLength(2);
      expect(nonZeroPoints[0].z).toBe(20);
      expect(nonZeroPoints[1].z).toBe(30);

      // Verify that points array length matches days in current month
      const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate();
      expect(result.value.points.length).toBe(daysInMonth);
    });
  });
});
