export type DataValue = { value: number };
export type DataPlot = { points: { y: number }[] };
export type DataHeatmap = { rows: number; points: { y: number; z: number }[] };

export type DataTimeRange = 'day' | 'week' | 'month' | 'year';
