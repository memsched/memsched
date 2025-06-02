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
