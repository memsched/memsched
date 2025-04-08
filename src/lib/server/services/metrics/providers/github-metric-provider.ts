import { type ResultAsync } from 'neverthrow';

import { assert } from '$lib/utils';

import type { DBType } from '../../../db';
import type { DrizzleError, WidgetMetric } from '../../../db/types';
import { GithubMetricsService } from '../../../services/github-metrics-service';
import type { DataHeatmap, DataPlot, DataValue } from '../data/types';
import type { BaseMetricProvider } from './base-metric-provider';

export class GithubMetricProvider implements BaseMetricProvider {
  private readonly githubService: GithubMetricsService;

  constructor(db: DBType) {
    this.githubService = new GithubMetricsService(db);
  }

  public getValueData(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError> {
    assert(metric.githubUsername, 'Missing required GitHub metric parameters');
    assert(metric.githubStatType, 'Missing required GitHub metric parameters');
    assert(metric.period, 'Missing required GitHub metric parameters');

    return this.githubService
      .fetchGitHubStats(metric.githubUsername, metric.period, metric.githubStatType)
      .map((value) => ({ value }));
  }

  public getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError> {
    assert(metric.githubUsername, 'Missing required GitHub metric parameters');
    assert(metric.githubStatType, 'Missing required GitHub metric parameters');
    assert(metric.period, 'Missing required GitHub metric parameters');

    // For now, we'll return a simple plot with just the current value
    // TODO: Implement time series data when available
    return this.githubService
      .fetchGitHubStats(metric.githubUsername, metric.period, metric.githubStatType)
      .map((value) => ({
        points: [{ y: value }],
      }));
  }

  public getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError> {
    assert(metric.githubUsername, 'Missing required GitHub metric parameters');
    assert(metric.githubStatType, 'Missing required GitHub metric parameters');
    assert(metric.period, 'Missing required GitHub metric parameters');

    // For now, we'll return a simple heatmap with just the current value
    // TODO: Implement proper heatmap data when available
    return this.githubService
      .fetchGitHubStats(metric.githubUsername, metric.period, metric.githubStatType)
      .map((value) => ({
        cols: 1,
        points: [{ z: value }],
      }));
  }
}
