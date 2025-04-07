import type { ResultAsync } from 'neverthrow';

import type { WidgetMetric } from '../../../db/schema';
import type { DrizzleError } from '../../../db/types';
import type { DataHeatmap, DataPlot, DataValue } from '../data/types';

export interface BaseMetricProvider {
  getValueData(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError>;
  getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError>;
  getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError>;
}
