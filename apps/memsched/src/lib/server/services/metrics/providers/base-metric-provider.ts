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
import type { ResultAsync } from 'neverthrow';

import type { WidgetMetric } from '../../../db/schema';
import type { DrizzleError } from '../../../db/types';
import type { DataHeatmap, DataPlot, DataValue } from '../data/types';

export interface BaseMetricProvider {
  getValueData(metric: WidgetMetric): ResultAsync<DataValue, DrizzleError>;
  getPlotData(metric: WidgetMetric): ResultAsync<DataPlot, DrizzleError>;
  getHeatmapData(metric: WidgetMetric): ResultAsync<DataHeatmap, DrizzleError>;
}
