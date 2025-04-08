import type { Widget, WidgetMetric } from '$lib/server/db/schema';
import type { NonNullableFieldsPick } from '$lib/server/types';

import type { DataHeatmap, DataPlot, DataValue } from './data/types';

type WidgetMetricDataBase = Omit<
  WidgetMetric,
  | 'id'
  | 'provider'
  | 'objectiveId'
  | 'githubUsername'
  | 'githubStatType'
  | 'widgetId'
  | 'userId'
  | 'createdAt'
>;

type WidgetMetricDataValueFields = NonNullableFieldsPick<
  WidgetMetric,
  'period' | 'valueDisplayPrecision'
>;

export type WidgetMetricDataValue = WidgetMetricDataBase & {
  style: 'metric-base' | 'metric-trend';
  data: DataValue;
} & WidgetMetricDataValueFields;

type WidgetMetricDataPlotBase = WidgetMetricDataBase & {
  style: 'plot-base';
  data: DataPlot;
};

export type WidgetMetricDataPlotMetric = WidgetMetricDataBase & {
  style: 'plot-metric';
  data: DataValue & DataPlot;
} & WidgetMetricDataValueFields;

export type WidgetMetricDataPlot = WidgetMetricDataPlotBase | WidgetMetricDataPlotMetric;

type WidgetMetricDataHeatmapBase = WidgetMetricDataBase & {
  style: 'heatmap-base';
  data: DataHeatmap;
};

export type WidgetMetricDataHeatmapMetric = WidgetMetricDataBase & {
  style: 'heatmap-metric';
  data: DataValue & DataHeatmap;
} & WidgetMetricDataValueFields;

export type WidgetMetricDataHeatmap = WidgetMetricDataHeatmapBase | WidgetMetricDataHeatmapMetric;

export type WidgetMetricData =
  | WidgetMetricDataValue
  | WidgetMetricDataPlot
  | WidgetMetricDataHeatmap;

export type WidgetData = Omit<Widget, 'id' | 'userId' | 'createdAt' | 'visibility'>;
export type WidgetJoinMetricsData = WidgetData & {
  metrics: WidgetMetricData[];
};

export interface BaseMetricService {
  getData(): any;
  cacheData(): any;
}
