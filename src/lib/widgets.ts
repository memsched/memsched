import { CIRCLE_FLAG_ICONS, VSCODE_ICONS } from './icons';
import type { WidgetJoinMetricsData } from './server/services/metrics/types';

const baseWidgets: WidgetJoinMetricsData[] = [
  {
    title: 'Projects Completed',
    subtitle: 'React Web Development',
    textIcon: null,
    imageUrl: VSCODE_ICONS.file_type_reactjs,
    imagePlacement: 'left',
    padding: 13,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ededed',
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        style: 'metric-trend',
        valueName: 'completed',
        valuePercent: false,
        data: {
          value: 13,
        },
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
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ededed',
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        style: 'heatmap-base',
        valueName: null,
        valuePercent: false,
        data: {
          cols: 7,
          points: new Array(31).fill(0).map((_, _i) => ({ z: Math.floor(Math.random() * 100) })),
        },
        order: 1,
      },
      {
        style: 'metric-trend',
        valueName: 'all time',
        valuePercent: false,
        data: {
          value: 953,
        },
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
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ededed',
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        style: 'plot-metric',
        valueName: 'all time',
        valuePercent: false,
        data: {
          value: 1452,
          points: new Array(14).fill(0).map((_, _i) => ({ y: Math.floor(Math.random() * 8) })),
        },
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
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ededed',
    color: '#000000',
    accentColor: '#4f8bce',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        style: 'plot-base',
        valueName: 'contributions',
        valuePercent: false,
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
        order: 1,
      },
      {
        style: 'metric-trend',
        valueName: 'all time',
        valuePercent: false,
        data: {
          value: 347,
        },
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
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ededed',
    color: '#000000',
    accentColor: '#9450ce',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        style: 'metric-trend',
        valueName: 'Design System',
        valuePercent: false,
        data: {
          value: 7,
        },
        order: 1,
      },
    ],
  },
];

// create three copies of the base widgets
export const mockWidgets: WidgetJoinMetricsData[] = Array.from({ length: 3 }, () =>
  baseWidgets.map((widget) => ({
    ...widget,
  }))
).flat();
