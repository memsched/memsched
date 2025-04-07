import type { ResultAsync } from 'neverthrow';
import type { DrizzleError } from '../../../db/types';
import type { WidgetMetric } from '../../../db/schema';
import type { DataPlot, DataHeatmap, DataValue } from '../data/types';

export interface BaseMetricProvider {
  getValue(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError>;
  getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError>;
  getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError>;
}
