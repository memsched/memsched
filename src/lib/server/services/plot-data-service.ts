import type { ObjectiveLogsService } from './objective-logs-service';
import type { GithubMetricsService, GithubStatType } from './github-metrics-service';
import type { WidgetMetric } from '../db/schema';
import { errAsync, okAsync, type ResultAsync } from 'neverthrow';
import type { DrizzleError } from '../db/types';
import { format, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

export type TimeRange = 'day' | 'week' | 'month' | 'year';

export type PlotDataPoint = {
  date: string;
  value: number;
};

export type PlotData = {
  points: PlotDataPoint[];
  timeRange: TimeRange;
};

export class PlotDataService {
  constructor(
    private readonly objectiveLogsService: ObjectiveLogsService,
    private readonly githubMetricsService: GithubMetricsService
  ) {}

  public getPlotData(
    metric: WidgetMetric,
    timeRange: TimeRange
  ): ResultAsync<PlotData, Error | DrizzleError> {
    if (metric.provider === 'objective' && metric.objectiveId) {
      return this.getObjectivePlotData(metric.objectiveId, metric.userId, timeRange);
    } else if (metric.provider === 'github' && metric.githubUsername && metric.githubStatType) {
      return this.getGithubPlotData(metric.githubUsername, metric.githubStatType, timeRange);
    }

    return errAsync(new Error('Invalid metric type or missing required fields'));
  }

  private getObjectivePlotData(
    objectiveId: string,
    userId: string,
    timeRange: TimeRange
  ): ResultAsync<PlotData, DrizzleError> {
    return this.objectiveLogsService.getAll(objectiveId, userId).andThen((logs) => {
      if (logs.length === 0) {
        return okAsync({
          points: [],
          timeRange,
        });
      }

      // Group logs by timeRange
      const groupedData = this.groupLogsByTimeRange(logs, timeRange);

      return okAsync({
        points: groupedData,
        timeRange,
      });
    });
  }

  private getGithubPlotData(
    username: string,
    statType: string,
    timeRange: TimeRange
  ): ResultAsync<PlotData, Error | DrizzleError> {
    // Choose the appropriate format string based on the time range
    let formatString: string;
    switch (timeRange) {
      case 'day':
        formatString = 'HH:mm'; // Hour format for day view
        break;
      case 'week':
        formatString = 'EEE dd'; // Day of week and date for week view
        break;
      case 'month':
        formatString = 'MMM dd'; // Month and day for month view
        break;
      case 'year':
        formatString = 'MMM'; // Month name for year view
        break;
      default:
        formatString = 'yyyy-MM-dd';
    }

    // Convert statType to the GithubStatType
    if (!['commits', 'repositories', 'followers'].includes(statType)) {
      return errAsync(new Error(`Invalid GitHub stat type: ${statType}`));
    }

    const githubStatType = statType as GithubStatType;

    return this.githubMetricsService
      .fetchGitHubTimeSeries(username, githubStatType, timeRange, formatString)
      .andThen((dataPoints) => {
        return okAsync({
          points: dataPoints,
          timeRange,
        });
      });
  }

  private groupLogsByTimeRange(logs: any[], timeRange: TimeRange): PlotDataPoint[] {
    // Group logs by the specified time range
    const groupedLogs = new Map<string, number>();

    for (const log of logs) {
      const logDate = new Date(log.loggedAt);
      let periodStart: Date;
      let formatString: string;

      switch (timeRange) {
        case 'day':
          periodStart = startOfDay(logDate);
          formatString = 'yyyy-MM-dd';
          break;
        case 'week':
          periodStart = startOfWeek(logDate, { weekStartsOn: 1 }); // Week starts on Monday
          formatString = 'yyyy-MM-dd';
          break;
        case 'month':
          periodStart = startOfMonth(logDate);
          formatString = 'yyyy-MM';
          break;
        case 'year':
          periodStart = startOfYear(logDate);
          formatString = 'yyyy';
          break;
      }

      const periodKey = format(periodStart, formatString);
      const currentValue = groupedLogs.get(periodKey) || 0;
      groupedLogs.set(periodKey, currentValue + log.value);
    }

    // Convert the map to an array of data points
    const dataPoints: PlotDataPoint[] = Array.from(groupedLogs.entries()).map(([date, value]) => ({
      date,
      value,
    }));

    // Sort data points by date
    return dataPoints.sort((a, b) => a.date.localeCompare(b.date));
  }
}
