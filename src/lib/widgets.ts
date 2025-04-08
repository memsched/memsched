import { CIRCLE_FLAG_ICONS, VSCODE_ICONS } from './icons';
import type { WidgetJoinMetricsData } from './server/services/metrics/types';

const backgroundColors = ['#ffffff', '#eaeaea', '#222222'];
const colors = ['#000000', '#000000', '#ffffff'];

const baseWidgets: WidgetJoinMetricsData[] = [
  {
    title: 'Projects Completed',
    subtitle: 'React Web Development',
    textIcon: null,
    imageUrl: VSCODE_ICONS.file_type_reactjs,
    imagePlacement: 'left',
    padding: 13,
    border: true,
    borderWidth: 1,
    borderRadius: 6,
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        name: 'completed',
        style: 'metric-trend',
        data: {
          value: 13,
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 1,
      },
    ],
  },

  {
    title: 'Hours Learning Japanese',
    subtitle: 'Journey to fluency',
    textIcon: null,
    imageUrl: CIRCLE_FLAG_ICONS.Japan,
    imagePlacement: 'left',
    padding: 13,
    border: true,
    borderWidth: 1,
    borderRadius: 6,
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        name: null,
        style: 'heatmap-base',
        data: {
          cols: 7,
          points: new Array(31).fill(0).map((_, _i) => ({ z: Math.floor(Math.random() * 100) })),
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 1,
      },
      {
        name: 'all time',
        style: 'metric-trend',
        data: {
          value: 953,
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 2,
      },
    ],
  },

  {
    title: 'GitHub Contributions',
    subtitle: 'Commit activity',
    textIcon: null,
    imageUrl: VSCODE_ICONS.folder_type_github,
    imagePlacement: 'left',
    padding: 13,
    border: true,
    borderWidth: 1,
    borderRadius: 6,
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        name: 'all time',
        style: 'plot-metric',
        data: {
          value: 1452,
          points: new Array(14).fill(0).map((_, _i) => ({ y: Math.floor(Math.random() * 8) })),
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 2,
      },
    ],
  },

  {
    title: 'Open Source Contributions',
    subtitle: 'Community collaboration',
    textIcon: 'OS',
    imageUrl: null,
    imagePlacement: 'left',
    padding: 13,
    border: true,
    borderWidth: 1,
    borderRadius: 6,
    color: '#000000',
    accentColor: '#4f8bce',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        name: 'contributions',
        style: 'plot-base',
        data: {
          points: [
            { y: 20 },
            { y: 30 },
            { y: 35 },
            { y: 90 },
            { y: 75 },
            { y: 60 },
            { y: 95 },
            { y: 140 },
            { y: 125 },
            { y: 150 },
          ],
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 1,
      },
      {
        name: 'all time',
        style: 'metric-trend',
        data: {
          value: 347,
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 2,
      },
    ],
  },

  {
    title: 'UI/UX Design',
    subtitle: 'User experience expertise',
    textIcon: 'UX',
    imageUrl: null,
    imagePlacement: 'left',
    padding: 13,
    border: true,
    borderWidth: 1,
    borderRadius: 6,
    color: '#000000',
    accentColor: '#9450ce',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        name: 'Design System',
        style: 'metric-trend',
        data: {
          value: 7,
        },
        period: 'day',
        valueDisplayPrecision: 0,
        valuePercent: false,
        order: 1,
      },
    ],
  },
];

// create three copies of the base widgets, each with a different background color
export const mockWidgets: WidgetJoinMetricsData[] = Array.from({ length: 3 }, (_, copyIndex) =>
  baseWidgets.map((widget) => ({
    ...widget,
    backgroundColor: backgroundColors[copyIndex],
    color: colors[copyIndex],
  }))
).flat();
