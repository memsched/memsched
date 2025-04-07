export type DataValue = { value: number };
export type DataPlot = { points: { y: number }[] };
export type DataHeatmap = { cols: number; points: { y: number; z: number }[] };

export type DataTimeRange = 'day' | 'week' | 'month' | 'year';
