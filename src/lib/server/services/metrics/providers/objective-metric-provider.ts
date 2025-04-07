import { assert, roundToDecimal } from '$lib/utils';
import type { ObjectiveLogsService } from '../../objective-logs-service';
import type { BaseMetricProvider } from './base-metric-provider';
import type { DataValue, DataPlot, DataHeatmap } from '../data/types';
import type { WidgetMetric } from '$lib/server/db/schema';
import { ResultAsync } from 'neverthrow';
import type { ObjectivesService } from '../../objectives-service';
import { type DrizzleError, wrapResultAsyncFn } from '../../../db/types';

export class ObjectiveMetricProvider implements BaseMetricProvider {
  constructor(
    private readonly objectiveService: ObjectivesService,
    private readonly objectiveLogsService: ObjectiveLogsService
  ) {}

  public getValueData(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      assert(metric.objectiveId !== null, 'Objective ID is required');
      assert(metric.valueAggregationType !== null, 'Value aggregation type is required');
      assert(metric.valueDisplayPrecision !== null, 'Value display precision is required');

      const value = await this.getObjectiveValue(
        metric.objectiveId!,
        metric.valueAggregationType!,
        metric.valueDisplayPrecision!,
        metric.userId
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
      return {
        points: [
          {
            y: 1,
          },
          {
            y: 2,
          },
          {
            y: 3,
          },
          {
            y: 4,
          },
          {
            y: 5,
          },
        ],
      };
    });
  }

  public getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      return {
        points: [
          {
            y: 1,
            z: 0.25,
          },
          {
            y: 2,
            z: 0.5,
          },
          {
            y: 3,
            z: 0.75,
          },
          {
            y: 4,
            z: 1,
          },
        ],
        rows: 1,
      };
    });
  }

  private getObjectiveValue(
    objectiveId: string,
    valueAggregationType: NonNullable<WidgetMetric['valueAggregationType']>,
    valueDisplayPrecision: NonNullable<WidgetMetric['valueDisplayPrecision']>,
    userId: string
  ) {
    return ResultAsync.fromPromise(
      (async () => {
        if (valueAggregationType === 'percentage') {
          const objectiveResult = await this.objectiveService.getUserObjective(objectiveId, userId);
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

        if (valueAggregationType === 'all time') {
          const result = await this.objectiveLogsService.getObjectiveLogsCount(objectiveId, userId);
          if (result.isErr()) {
            throw result.error;
          }
          return roundToDecimal(result.value, valueDisplayPrecision);
        } else {
          // Define time filter based on calculation type
          const timeAgo = new Date();
          if (valueAggregationType === 'day') {
            timeAgo.setDate(timeAgo.getDate() - 1);
          } else if (valueAggregationType === 'week') {
            timeAgo.setDate(timeAgo.getDate() - 7);
          } else if (valueAggregationType === 'month') {
            timeAgo.setMonth(timeAgo.getMonth() - 1);
          } else if (valueAggregationType === 'year') {
            timeAgo.setFullYear(timeAgo.getFullYear() - 1);
          } else {
            return 0; // Unknown calculation type
          }

          // Use SQL to filter by date and calculate sum in one operation
          const result = await this.objectiveLogsService.getObjectiveLogsCount(
            objectiveId,
            userId,
            {
              startDate: timeAgo,
            }
          );
          if (result.isErr()) {
            throw result.error;
          }
          return roundToDecimal(result.value, valueDisplayPrecision);
        }
      })(),
      (error) => error as Error
    );
  }
}
