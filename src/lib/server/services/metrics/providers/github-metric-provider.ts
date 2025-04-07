import { type ResultAsync } from 'neverthrow';

import type { DBType } from '../../../db';
import type { DrizzleError, WidgetMetric } from '../../../db/types';
import type { DataHeatmap, DataPlot, DataValue } from '../data/types';
import type { BaseMetricProvider } from './base-metric-provider';

export class GithubMetricProvider implements BaseMetricProvider {
  constructor(private readonly db: DBType) {}

  public getValueData(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError> {
    throw new Error('Not implemented');
  }

  public getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError> {
    throw new Error('Not implemented');
  }

  public getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError> {
    throw new Error('Not implemented');
  }
}
