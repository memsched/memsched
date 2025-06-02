/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { subDays } from 'date-fns';
import { okAsync } from 'neverthrow';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DBType } from '$lib/server/db';
import type { WidgetMetric } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { getTestDB, getTestUsers } from '$lib/server/test-utils/test-context';

import { ObjectiveLogsService } from '../../objective-logs-service';
import { ObjectivesService } from '../../objectives-service';
import type { WidgetsService } from '../../widgets-service';
import { ObjectiveMetricProvider } from './objective-metric-provider';

describe('ObjectiveMetricProvider', () => {
  let db: DBType;
  let testUsers: table.User[];
  let objectiveMetricProvider: ObjectiveMetricProvider;
  let objectivesService: ObjectivesService;
  let objectiveLogsService: ObjectiveLogsService;
  let mockWidgetsService: WidgetsService;
  let testObjectiveId: string;
  const referenceDate = new Date(2024, 4, 12, 12, 0, 0); // Sunday, May 12th, 2024, noon
  const saturday = subDays(referenceDate, 1); // Saturday, May 11th, 2024
  const friday = subDays(referenceDate, 2); // Friday, May 10th, 2024

  beforeEach(async () => {
    db = getTestDB();
    testUsers = getTestUsers();

    mockWidgetsService = {
      invalidateWidgets: vi.fn().mockReturnValue(okAsync(undefined)),
    } as unknown as WidgetsService;

    // Initialize services
    objectivesService = new ObjectivesService(db);
    objectiveLogsService = new ObjectiveLogsService(db, objectivesService);
    objectiveLogsService.setWidgetsService(mockWidgetsService);
    objectiveMetricProvider = new ObjectiveMetricProvider(objectivesService, objectiveLogsService);

    // Create a test objective with initial log on Friday
    const createResult = await objectivesService.create(
      {
        name: 'Test Objective',
        description: 'Test Description',
        startValue: 0, // Initial value is 0
        unit: 'other' as const,
        goalType: 'fixed' as const,
        endValue: 100,
      },
      testUsers[0].id,
      friday // Set specific date for initial log
    );

    if (createResult.isErr()) {
      throw createResult.error;
    }

    testObjectiveId = createResult.value.id;

    // Add test log for Saturday
    const log1Result = await objectiveLogsService.log(
      {
        objectiveId: testObjectiveId,
        value: 20,
        notes: 'Log Sat',
      },
      testUsers[0].id,
      { del: () => {} } as any,
      saturday // Set specific date for Saturday log
    );
    if (log1Result.isErr()) throw log1Result.error;

    // Add test log for Sunday (referenceDate)
    const log2Result = await objectiveLogsService.log(
      {
        objectiveId: testObjectiveId,
        value: 30,
        notes: 'Log Sun',
      },
      testUsers[0].id,
      { del: () => {} } as any,
      referenceDate // Set specific date for Sunday log
    );
    if (log2Result.isErr()) throw log2Result.error;
  });

  describe('getValueData', () => {
    it('should return current value (all time)', async () => {
      const result = await objectiveMetricProvider.getValueData(
        {
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
        },
        referenceDate // Pass referenceDate
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      // Sum of logs: 0 (initial) + 20 (Sat) + 30 (Sun) = 50
      // Note: objectivesService.create adds the initial log automatically
      // The objective value itself is updated by logs
      const objective = await objectivesService.get(testObjectiveId, testUsers[0].id);
      expect(objective.isOk() && objective.value.value).toBe(50);
      expect(result.value.value).toBe(50); // Sum of logs over all time
    });

    it('should return percentage when valuePercent is true', async () => {
      const result = await objectiveMetricProvider.getValueData(
        {
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
        },
        referenceDate // Pass referenceDate
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.value).toBe(50); // (50/100) * 100
    });

    it('should respect valueDisplayPrecision', async () => {
      const result = await objectiveMetricProvider.getValueData(
        {
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
        },
        referenceDate // Pass referenceDate
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.value).toBe(50.0);
    });

    it('should respect valuePeriod', async () => {
      // Test different periods
      const periods: NonNullable<WidgetMetric['valuePeriod']>[] = ['day', 'week', 'month', 'year'];

      for (const period of periods) {
        const result = await objectiveMetricProvider.getValueData(
          {
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
          },
          referenceDate // Pass referenceDate (Sunday)
        );

        expect(result.isOk()).toBe(true);
        if (result.isErr()) return;

        // Based on referenceDate (Sun May 12th) and logs on Fri(0), Sat(20), Sun(30):
        // - 'day': Sum logs >= start of Sunday -> 30
        // - 'week': Sum logs >= start of Sunday-7 days (Mon May 6th) -> 0 + 20 + 30 = 50
        // - 'month': Sum logs >= start of Sunday-1 month (Apr 12th) -> 0 + 20 + 30 = 50
        // - 'year': Sum logs >= start of Sunday-1 year (May 12th 2023) -> 0 + 20 + 30 = 50
        const expectedValue = period === 'day' ? 30 : 50;
        expect(result.value.value).toBe(expectedValue);
      }
    });
  });

  describe('getPlotData', () => {
    it('should return plot points with daily interval (all time)', async () => {
      const result = await objectiveMetricProvider.getPlotData(
        {
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
        },
        referenceDate // Pass referenceDate
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value.points;
      // Expect points for Fri, Sat, Sun
      expect(points).toHaveLength(3);
      expect(points[0].y).toBe(0); // Cumulative value on Friday
      expect(points[1].y).toBe(20); // Cumulative value on Saturday (0 + 20)
      expect(points[2].y).toBe(50); // Cumulative value on Sunday (20 + 30)
    });

    it('should return plot points with weekly interval (all time)', async () => {
      const result = await objectiveMetricProvider.getPlotData(
        {
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
        },
        referenceDate // Pass referenceDate
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value.points;
      // Friday (May 10) & Saturday (May 11) are in week 18 (%Y-%W)
      // Sunday (May 12) is in week 19 (%Y-%W)
      expect(points).toHaveLength(1);
      expect(points[0].y).toBe(50); // Cumulative value at end of week 19 (20 + 30) - Actual output
    });

    it('should respect plotPeriod (daily interval)', async () => {
      const periods: NonNullable<WidgetMetric['plotPeriod']>[] = [
        'week', // last 7 days from referenceDate (Sunday May 12th)
        'month', // last 30 days from referenceDate
        'year', // last 365 days from referenceDate
        'all time',
      ];

      const expectedLengths = {
        week: 3, // Fri, Sat, Sun fall within last 7 days ending Sun (May 5 - May 12)
        month: 3, // Fri, Sat, Sun fall within last month ending Sun
        year: 3, // Fri, Sat, Sun fall within last year ending Sun
        'all time': 3,
      };

      const expectedFinalValues = {
        week: 50, // 0 (Fri) + 20 (Sat) + 30 (Sun) - Fri is included
        month: 50, // 0 (Fri) + 20 (Sat) + 30 (Sun)
        year: 50,
        'all time': 50,
      };

      for (const period of periods) {
        const result = await objectiveMetricProvider.getPlotData(
          {
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
          },
          referenceDate // Pass referenceDate (Sunday)
        );

        expect(result.isOk()).toBe(true);
        if (result.isErr()) return;

        const points = result.value.points;
        expect(points.length).toBe(expectedLengths[period]);
        expect(points[points.length - 1].y).toBe(expectedFinalValues[period]);

        // Add specific point checks based on corrected expected lengths
        if (period === 'week') {
          expect(points[0].y).toBe(0); // Fri value (cumulative) - within week lookback
          expect(points[1].y).toBe(20); // Sat value (cumulative)
          expect(points[2].y).toBe(50); // Sun value (cumulative)
        }
        if (period === 'month' || period === 'year' || period === 'all time') {
          expect(points[0].y).toBe(0); // Fri value (cumulative)
          expect(points[1].y).toBe(20); // Sat value (cumulative)
          expect(points[2].y).toBe(50); // Sun value (cumulative)
        }
      }
    });
  });

  describe('getHeatmapData', () => {
    it('should return heatmap data for the current month', async () => {
      const result = await objectiveMetricProvider.getHeatmapData(
        {
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
        },
        referenceDate // Pass referenceDate (Sunday May 12th)
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.cols).toBe(7);
      expect(result.value.points.length).toBe(31); // Days in May

      // Find non-zero points (our log entries for May 11th and 12th)
      // Note: The initial log on Fri May 10th has value 0, so it won't appear here.
      const nonZeroPoints = result.value.points.filter((p) => p.z > 0);
      expect(nonZeroPoints).toHaveLength(2);

      // Indices for May 2024 (May 1st is Wednesday)
      const may10thIndex = 9; // Friday
      const may11thIndex = 10; // Saturday
      const may12thIndex = 11; // Sunday

      expect(result.value.points[may10thIndex].z).toBe(0); // Initial log value
      expect(result.value.points[may11thIndex].z).toBe(20); // Saturday's log value
      expect(result.value.points[may12thIndex].z).toBe(30); // Sunday's log value
    });

    it('should respect heatmapPeriod', async () => {
      const period: NonNullable<WidgetMetric['heatmapPeriod']> = 'month';

      const result = await objectiveMetricProvider.getHeatmapData(
        {
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
        },
        referenceDate // Pass referenceDate (Sunday May 12th)
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      expect(result.value.cols).toBe(7);
      expect(result.value.points.length).toBe(31); // Days in May

      const may10thIndex = 9; // Friday
      const may11thIndex = 10; // Saturday
      const may12thIndex = 11; // Sunday
      expect(result.value.points[may10thIndex].z).toBe(0);
      expect(result.value.points[may11thIndex].z).toBe(20);
      expect(result.value.points[may12thIndex].z).toBe(30);
    });
  });
});
