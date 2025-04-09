import { startOfMonth, subDays } from 'date-fns';
import { eq } from 'drizzle-orm';
import { okAsync } from 'neverthrow';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DBType } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getTestDB, getTestUsers } from '$lib/server/test-utils/test-context';

import type { CacheService } from '../cache';
import { MetricsService } from './metrics-service';
import { ObjectiveLogsService } from './objective-logs-service';
import { ObjectivesService } from './objectives-service';

describe('ObjectiveLogsService', () => {
  let db: DBType;
  let testUsers: table.User[];
  let objectiveLogsService: ObjectiveLogsService;
  let objectivesService: ObjectivesService;
  let metricsService: MetricsService;
  let mockCache: CacheService;
  let testObjectiveId: string;

  beforeEach(async () => {
    db = getTestDB();
    testUsers = getTestUsers();

    // Create mock services with proper Result types
    metricsService = {
      invalidateMetrics: vi.fn().mockImplementation(() => okAsync(undefined)),
    } as unknown as MetricsService;

    mockCache = {
      del: vi.fn(),
    } as unknown as CacheService;

    objectivesService = new ObjectivesService(db);
    objectiveLogsService = new ObjectiveLogsService(db, objectivesService, metricsService);

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
  });

  describe('log', () => {
    it('should create a log entry and update objective value', async () => {
      const logData = {
        objectiveId: testObjectiveId,
        value: 5,
        notes: 'Test log entry',
      };

      const result = await objectiveLogsService.log(logData, testUsers[0].id, mockCache);

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const [objective, _logResult] = result.value;
      expect(objective.value).toBe(5);

      // Get the logs to verify
      const logsResult = await objectiveLogsService.getAll(testObjectiveId, testUsers[0].id);
      expect(logsResult.isOk()).toBe(true);
      if (logsResult.isErr()) return;

      const logs = logsResult.value;
      expect(logs[0].value).toBe(5);
      expect(logs[0].notes).toBe('Test log entry');
    });

    it('should accumulate multiple log entries', async () => {
      const logData1 = {
        objectiveId: testObjectiveId,
        value: 5,
        notes: 'First log',
      };

      const logData2 = {
        objectiveId: testObjectiveId,
        value: 3,
        notes: 'Second log',
      };

      await objectiveLogsService.log(logData1, testUsers[0].id, mockCache);
      const result = await objectiveLogsService.log(logData2, testUsers[0].id, mockCache);

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const [objective] = result.value;
      expect(objective.value).toBe(8);
    });
  });

  describe('undoLog', () => {
    it('should remove the last log entry and update objective value', async () => {
      // First add a log
      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 5,
          notes: 'Test log',
        },
        testUsers[0].id,
        mockCache
      );

      // Then undo it
      const result = await objectiveLogsService.undoLog(
        testObjectiveId,
        testUsers[0].id,
        mockCache
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const [objective] = result.value;
      expect(objective.value).toBe(0);
    });

    it('should not allow value to go below 0 when undoing', async () => {
      // First add a log with value 5
      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 5,
          notes: 'First log',
        },
        testUsers[0].id,
        mockCache
      );

      // Then add another log with value -3
      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: -3,
          notes: 'Second log',
        },
        testUsers[0].id,
        mockCache
      );

      // Undo the last log
      const result = await objectiveLogsService.undoLog(
        testObjectiveId,
        testUsers[0].id,
        mockCache
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const [objective] = result.value;
      expect(objective.value).toBe(5);
    });
  });

  describe('getRunningLogPoints', () => {
    it('should return cumulative values by day', async () => {
      const today = new Date();
      const yesterday = subDays(today, 1);

      // Add logs for two days
      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 5,
          notes: 'Yesterday log',
        },
        testUsers[0].id,
        mockCache
      );

      // Manually set the date for the second log
      await db
        .update(table.objectiveLog)
        .set({ loggedAt: yesterday })
        .where(eq(table.objectiveLog.objectiveId, testObjectiveId));

      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 3,
          notes: 'Today log',
        },
        testUsers[0].id,
        mockCache
      );

      const result = await objectiveLogsService.getRunningLogPoints(
        testObjectiveId,
        testUsers[0].id
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value;
      expect(points).toHaveLength(2);
      expect(points[0].value).toBe(5);
      expect(points[1].value).toBe(8);
    });
  });

  describe('getWeeklyLogPoints', () => {
    it('should return cumulative values by week', async () => {
      const today = new Date();
      const lastWeek = subDays(today, 7);

      // Add logs for two weeks
      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 10,
          notes: 'Last week log',
        },
        testUsers[0].id,
        mockCache
      );

      // Manually set the date for the first log
      await db
        .update(table.objectiveLog)
        .set({ loggedAt: lastWeek })
        .where(eq(table.objectiveLog.objectiveId, testObjectiveId));

      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 5,
          notes: 'This week log',
        },
        testUsers[0].id,
        mockCache
      );

      const result = await objectiveLogsService.getWeeklyLogPoints(
        testObjectiveId,
        testUsers[0].id
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value;
      expect(points).toHaveLength(2);
      expect(points[0].value).toBe(10);
      expect(points[1].value).toBe(15);
    });
  });

  describe('getMonthlyLogPoints', () => {
    it('should return cumulative values by month', async () => {
      const today = new Date();
      const lastMonth = startOfMonth(subDays(today, 32)); // Ensure we're in the previous month

      // Add logs for two months
      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 20,
          notes: 'Last month log',
        },
        testUsers[0].id,
        mockCache
      );

      // Manually set the date for the first log
      await db
        .update(table.objectiveLog)
        .set({ loggedAt: lastMonth })
        .where(eq(table.objectiveLog.objectiveId, testObjectiveId));

      await objectiveLogsService.log(
        {
          objectiveId: testObjectiveId,
          value: 10,
          notes: 'This month log',
        },
        testUsers[0].id,
        mockCache
      );

      const result = await objectiveLogsService.getMonthlyLogPoints(
        testObjectiveId,
        testUsers[0].id
      );

      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const points = result.value;
      expect(points).toHaveLength(2);
      expect(points[0].value).toBe(20);
      expect(points[1].value).toBe(30);
    });
  });
});
