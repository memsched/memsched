import { okAsync, ResultAsync } from 'neverthrow';
import type { DBType } from '../../../db';
import type { DrizzleError, WidgetMetric } from '../../../db/schema';
import { MetricProviderFactory } from '../providers/metric-provider-factory';
import type { WidgetMetricData } from '../types';

export class MetricDataService {
  private metricProviderFactory: MetricProviderFactory;

  constructor(private readonly db: DBType) {
    this.metricProviderFactory = new MetricProviderFactory(this.db);
  }

  public getData(metric: WidgetMetric): ResultAsync<WidgetMetricData['data'], DrizzleError> {
    switch (metric.style) {
      case 'metric-base':
      case 'metric-trend':
        return this.metricProviderFactory.getProvider(metric.provider).getValue(metric);
      case 'plot-base':
        return this.metricProviderFactory.getProvider(metric.provider).getPlotData(metric);
      case 'plot-metric':
        return ResultAsync.combine([
          this.metricProviderFactory.getProvider(metric.provider).getValue(metric),
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
          this.metricProviderFactory.getProvider(metric.provider).getValue(metric),
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
