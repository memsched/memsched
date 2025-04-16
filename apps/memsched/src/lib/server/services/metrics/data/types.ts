export type DataValue = { value: number };
export type DataPlot = { points: { y: number }[] };
export type DataHeatmap = { cols: number; points: { z: number }[] };

export type DataTimeRange = 'day' | 'week' | 'month' | 'year';
