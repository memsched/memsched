import { addDays, endOfMonth, format, getDaysInMonth, startOfDay, startOfMonth } from 'date-fns';
import { ResultAsync } from 'neverthrow';

import type { WidgetMetric } from '$lib/server/db/schema';
import { assert, roundToDecimal } from '$lib/utils';

import { type DrizzleError, wrapResultAsyncFn } from '../../../db/types';
import type { ObjectiveLogsService } from '../../objective-logs-service';
import type { ObjectivesService } from '../../objectives-service';
import type { DataHeatmap, DataPlot, DataValue } from '../data/types';
import type { BaseMetricProvider } from './base-metric-provider';

export class ObjectiveMetricProvider implements BaseMetricProvider {
  constructor(
    private readonly objectiveService: ObjectivesService,
    private readonly objectiveLogsService: ObjectiveLogsService
  ) {}

  public getValueData(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      assert(metric.objectiveId !== null, 'Objective ID is required');
      assert(metric.period !== null, 'Period is required');
      assert(metric.valueDisplayPrecision !== null, 'Value display precision is required');

      const value = await this.getObjectiveValue(
        metric.objectiveId!,
        metric.period!,
        metric.valueDisplayPrecision!,
        metric.valuePercent ?? false,
        metric.userId!
      );

      if (value.isErr()) {
        throw value.error;
      }

      return {
        value: roundToDecimal(value.value, metric.valueDisplayPrecision!),
      };
    });
  }

  public getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      assert(metric.objectiveId !== null, 'Objective ID is required');

      const timeAgo = this.getTimeAgoForPeriod(metric.period!);
      const logs = await this.objectiveLogsService.getRunningLogPoints(
        metric.objectiveId!,
        metric.userId,
        timeAgo ? { startDate: timeAgo } : undefined
      );

      if (logs.isErr()) {
        throw logs.error;
      }

      return {
        points: logs.value.map(({ value }) => ({
          y: value,
        })),
      };
    });
  }

  public getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      assert(metric.objectiveId !== null, 'Objective ID is required');

      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const daysInMonth = getDaysInMonth(now);

      // Get logs for the current month
      const logs = await this.objectiveLogsService.getDailyLogPoints(
        metric.objectiveId!,
        metric.userId,
        { startDate: monthStart, endDate: monthEnd }
      );

      if (logs.isErr()) {
        throw logs.error;
      }

      // Create a map of existing dates and their values
      const dateValueMap = new Map(logs.value.map((r) => [r.date, r.value]));

      // Create array for all dates in the month
      const allDates: { date: string; value: number }[] = [];
      let currentDate = startOfDay(monthStart);

      // Fill in all days of the month
      for (let day = 0; day < daysInMonth; day++) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        allDates.push({
          date: dateStr,
          value: dateValueMap.get(dateStr) || 0,
        });
        currentDate = addDays(currentDate, 1);
      }

      // Create the points array
      const points = allDates.map(({ value }) => ({
        z: value,
      }));

      return {
        points,
        cols: 7,
      };
    });
  }

  private getObjectiveValue(
    objectiveId: string,
    period: NonNullable<WidgetMetric['period']>,
    valueDisplayPrecision: NonNullable<WidgetMetric['valueDisplayPrecision']>,
    valuePercent: boolean,
    userId: string
  ) {
    return wrapResultAsyncFn(async () => {
      if (valuePercent) {
        const objectiveResult = await this.objectiveService.get(objectiveId, userId);
        if (objectiveResult.isErr()) {
          throw objectiveResult.error;
        }
        const objective = objectiveResult.value;

        if (objective.goalType !== 'fixed' || !objective.endValue) {
          return 0;
        }

        // Calculate percentage of completion
        const percentage = (objective.value / objective.endValue) * 100;
        return roundToDecimal(percentage, valueDisplayPrecision);
      }

      if (period === 'all time') {
        const result = await this.objectiveLogsService.getSum(objectiveId, userId);
        if (result.isErr()) {
          throw result.error;
        }
        return roundToDecimal(result.value, valueDisplayPrecision);
      }

      const timeAgo = this.getTimeAgoForPeriod(period);
      if (!timeAgo) {
        return 0;
      }

      // Use SQL to filter by date and calculate sum in one operation
      const result = await this.objectiveLogsService.getSum(objectiveId, userId, {
        startDate: timeAgo,
      });
      if (result.isErr()) {
        throw result.error;
      }
      return roundToDecimal(result.value, valueDisplayPrecision);
    });
  }

  private getTimeAgoForPeriod(period: NonNullable<WidgetMetric['period']>): Date | null {
    if (period === 'all time') {
      return null;
    }

    const timeAgo = new Date();
    switch (period) {
      case 'day':
        timeAgo.setDate(timeAgo.getDate() - 1);
        break;
      case 'week':
        timeAgo.setDate(timeAgo.getDate() - 7); // TODO: Use ISO week number
        break;
      case 'month':
        timeAgo.setMonth(timeAgo.getMonth() - 1);
        break;
      case 'year':
        timeAgo.setFullYear(timeAgo.getFullYear() - 1);
        break;
      default:
        return null;
    }
    return timeAgo;
  }
}
