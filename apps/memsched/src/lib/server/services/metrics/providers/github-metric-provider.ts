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
    assert(metric.valuePeriod, 'Missing required GitHub metric parameters');

    return this.githubService
      .fetchGitHubStats(metric.githubUsername, metric.valuePeriod, metric.githubStatType)
      .map((value) => ({ value }));
  }

  public getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError> {
    assert(metric.githubUsername, 'Missing required GitHub metric parameters');
    assert(metric.githubStatType, 'Missing required GitHub metric parameters');
    assert(metric.valuePeriod, 'Missing required GitHub metric parameters');

    // For now, we'll return a simple plot with just the current value
    // TODO: Implement time series data when available
    return this.githubService
      .fetchGitHubStats(metric.githubUsername, metric.valuePeriod, metric.githubStatType)
      .map((value) => ({
        points: [{ y: value }],
      }));
  }

  public getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError> {
    assert(metric.githubUsername, 'Missing required GitHub metric parameters');
    assert(metric.githubStatType, 'Missing required GitHub metric parameters');
    assert(metric.valuePeriod, 'Missing required GitHub metric parameters');

    // For now, we'll return a simple heatmap with just the current value
    // TODO: Implement proper heatmap data when available
    return this.githubService
      .fetchGitHubStats(metric.githubUsername, metric.valuePeriod, metric.githubStatType)
      .map((value) => ({
        cols: 1,
        points: [{ z: value }],
      }));
  }
}
