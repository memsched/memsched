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
import { okAsync, ResultAsync } from 'neverthrow';

import type { DBType } from '../../../db';
import type { DrizzleError, WidgetMetric } from '../../../db/schema';
import type { ObjectiveLogsService } from '../../objective-logs-service';
import type { ObjectivesService } from '../../objectives-service';
import { MetricProviderFactory } from '../providers/metric-provider-factory';
import type { WidgetMetricData } from '../types';

export class MetricDataService {
  private metricProviderFactory: MetricProviderFactory;

  constructor(
    private readonly db: DBType,
    private readonly objectivesService: ObjectivesService,
    private readonly objectiveLogsService: ObjectiveLogsService
  ) {
    this.metricProviderFactory = new MetricProviderFactory(
      this.db,
      this.objectivesService,
      this.objectiveLogsService
    );
  }

  public getData(metric: WidgetMetric): ResultAsync<WidgetMetricData['data'], DrizzleError> {
    switch (metric.style) {
      case 'metric-base':
      case 'metric-trend':
        return this.metricProviderFactory.getProvider(metric.provider).getValueData(metric);
      case 'plot-base':
        return this.metricProviderFactory.getProvider(metric.provider).getPlotData(metric);
      case 'plot-metric':
        return ResultAsync.combine([
          this.metricProviderFactory.getProvider(metric.provider).getValueData(metric),
          this.metricProviderFactory.getProvider(metric.provider).getPlotData(metric),
        ]).andThen(([value, points]) => {
          return okAsync({
            ...value,
            ...points,
          });
        });
      case 'heatmap-base':
        return this.metricProviderFactory.getProvider(metric.provider).getHeatmapData(metric);
      case 'heatmap-metric':
        return ResultAsync.combine([
          this.metricProviderFactory.getProvider(metric.provider).getValueData(metric),
          this.metricProviderFactory.getProvider(metric.provider).getHeatmapData(metric),
        ]).andThen(([value, points]) => {
          return okAsync({
            ...value,
            ...points,
          });
        });
      default:
        throw new Error(`Unknown provider: ${metric.provider}`);
    }
  }
}
