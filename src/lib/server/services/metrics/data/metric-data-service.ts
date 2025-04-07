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
