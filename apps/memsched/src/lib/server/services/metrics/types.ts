import type { Widget, WidgetMetric } from '$lib/server/db/schema';

import type { DataHeatmap, DataPlot, DataValue } from './data/types';

type WidgetMetricDataBase = Omit<
  WidgetMetric,
  | 'id'
  | 'valuePeriod'
  | 'valueDisplayPrecision'
  | 'plotPeriod'
  | 'plotInterval'
  | 'heatmapPeriod'
  | 'heatmapInterval'
  | 'provider'
  | 'objectiveId'
  | 'githubUsername'
  | 'githubStatType'
  | 'widgetId'
  | 'userId'
  | 'createdAt'
>;

export type WidgetMetricDataValue = WidgetMetricDataBase & {
  style: 'metric-base' | 'metric-trend';
  data: DataValue;
};

type WidgetMetricDataPlotBase = WidgetMetricDataBase & {
  style: 'plot-base';
  data: DataPlot;
};

export type WidgetMetricDataPlotMetric = WidgetMetricDataBase & {
  style: 'plot-metric';
  data: DataValue & DataPlot;
};

export type WidgetMetricDataPlot = WidgetMetricDataPlotBase | WidgetMetricDataPlotMetric;

type WidgetMetricDataHeatmapBase = WidgetMetricDataBase & {
  style: 'heatmap-base';
  data: DataHeatmap;
};

export type WidgetMetricDataHeatmapMetric = WidgetMetricDataBase & {
  style: 'heatmap-metric';
  data: DataValue & DataHeatmap;
};

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
