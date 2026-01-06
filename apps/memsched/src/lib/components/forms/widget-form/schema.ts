import { z } from 'zod';

export const WIDGET_METRIC_PROVIDER = ['objective', 'github'] as const;
export const WIDGET_METRIC_STYLE = [
  'metric-base',
  'metric-trend',
  'plot-base',
  'plot-metric',
  'heatmap-base',
  'heatmap-metric',
] as const;
export const WIDGET_METRIC_VALUE_PERIOD = ['day', 'week', 'month', 'year', 'all time'] as const;
export const WIDGET_METRIC_PLOT_PERIOD = ['week', 'month', 'year', 'all time'] as const;
export const WIDGET_METRIC_HEATMAP_PERIOD = ['month'] as const;

export const WIDGET_METRIC_PLOT_INTERVAL = ['day', 'week', 'month', 'year'] as const;
export const WIDGET_METRIC_HEATMAP_INTERVAL = ['day'] as const;

export const WIDGET_METRIC_GITHUB_STAT_TYPE = ['commits', 'repositories', 'followers'] as const;
export const WIDGET_METRIC_DISPLAY_PRECISION_MAX = 2;

// Configurations
export const VALUE_CONFIGURATION = ['metric-base', 'metric-trend', 'plot-metric', 'heatmap-metric'];
export const PLOT_CONFIGURATION = ['plot-base', 'plot-metric'];
export const HEATMAP_CONFIGURATION = ['heatmap-base', 'heatmap-metric'];

const widgetMetricBaseSchema = z.object({
  style: z
    .enum(WIDGET_METRIC_STYLE, {
      message: 'Please select a valid style.',
    })
    .default('metric-base'),
  // Value Configuration (metric-base, metric-trend, plot-metric, heatmap-metric)
  valueName: z
    .string()
    .max(25, { message: 'Name must be less than 25 characters.' })
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  valuePeriod: z
    .enum(WIDGET_METRIC_VALUE_PERIOD, {
      message: 'Please select a valid aggregation type.',
    })
    .default('day'),
  valueDisplayPrecision: z
    .number({ message: 'Please enter a valid value decimal precision: 0, 1, or 2.' })
    .int({
      message: 'Please select a valid value decimal precision: 0, 1, or 2.',
    })
    .min(0, { message: 'Value decimal precision must be greater than or equal to 0.' })
    .max(WIDGET_METRIC_DISPLAY_PRECISION_MAX, {
      message: 'Value decimal precision must be less than or equal to 2.',
    })
    .default(0),
  valuePercent: z.boolean().default(false),
  // Plot Configuration (plot-base, plot-metric)
  plotPeriod: z
    .enum(WIDGET_METRIC_PLOT_PERIOD, {
      message: 'Please select a valid plot period.',
    })
    .default('week'),
  plotInterval: z
    .enum(WIDGET_METRIC_PLOT_INTERVAL, {
      message: 'Please select a valid plot interval.',
    })
    .default('day'),
  // Heatmap Configuration (heatmap-base, heatmap-metric)
  heatmapPeriod: z
    .enum(WIDGET_METRIC_HEATMAP_PERIOD, {
      message: 'Please select a valid heatmap period.',
    })
    .default('month'),
  heatmapInterval: z
    .enum(WIDGET_METRIC_HEATMAP_INTERVAL, {
      message: 'Please select a valid heatmap interval.',
    })
    .default('day'),
});

const objectiveWidgetMetricSchema = widgetMetricBaseSchema.extend({
  provider: z.literal('objective'),
  objectiveId: z.string().min(1, { message: 'Objective is required.' }),
  githubUsername: z.string().nullable(),
  githubStatType: z.enum(WIDGET_METRIC_GITHUB_STAT_TYPE).nullable(),
});

const githubWidgetMetricSchema = widgetMetricBaseSchema.extend({
  provider: z.literal('github'),
  objectiveId: z.string().nullable(),
  githubUsername: z.string().min(1, { message: 'GitHub username is required.' }),
  githubStatType: z.enum(WIDGET_METRIC_GITHUB_STAT_TYPE).default('commits'),
});

export const widgetMetricSchema = z.discriminatedUnion('provider', [
  objectiveWidgetMetricSchema,
  githubWidgetMetricSchema,
]);

export const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(50, { message: 'Title must be less than 50 characters.' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required.' })
    .max(100, { message: 'Subtitle must be less than 100 characters.' }),
  imageUrl: z
    .string()
    .refine(
      (url) => {
        if (!url) return true;
        // Allow non-SVG data URLs or SVG file URLs from server
        if (url.startsWith('data:image/')) {
          return !url.startsWith('data:image/svg+xml');
        }
        return url.match(/^https?:\/\//) && url.toLowerCase().endsWith('.svg');
      },
      { message: 'Image URL must be a raster image data URL or an SVG file URL from the server' }
    )
    .nullable()
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v)),
  textIcon: z
    .string()
    .max(2, { message: 'Text icon must be 1-2 characters.' })
    .regex(/^[A-Z]{1,2}$/, { message: 'Text icon must be 1-2 capital letters.' })
    .nullable()
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v)),
  imagePlacement: z.enum(['left', 'right']).default('left'),
  visibility: z
    .enum(['public', 'private'], {
      message: 'Visibility should be either "public" or "private".',
    })
    .default('public'),

  // Styling options
  padding: z
    .number()
    .int()
    .min(0, { message: 'Padding must be 0 or greater.' })
    .max(30, { message: 'Padding must be less than 30.' })
    .default(13),
  borderWidth: z
    .number()
    .int()
    .min(0, { message: 'Border width must be 0 or greater.' })
    .max(10, { message: 'Border width must be less than 10.' })
    .default(1),
  borderRadius: z
    .number()
    .int()
    .min(0, { message: 'Border radius must be 0 or greater.' })
    .max(50, { message: 'Border radius must be less than 50.' })
    .default(6),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Please enter a valid hex color code.' })
    .default('#ededed'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Please enter a valid hex color code.' })
    .default('#000000'),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Please enter a valid hex color code for the accent.' })
    .default('#32ad86'),
  backgroundColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, {
      message: 'Please enter a valid hex color code (with optional alpha).',
    })
    .default('#ffffff'),
  watermark: z.boolean().default(true),

  // Metrics
  metrics: z
    .array(widgetMetricSchema)
    .max(3, { message: 'Maximum of 3 metrics allowed.' })
    .default([]),
});

export type FormSchema = typeof formSchema;
export type WidgetMetricSchema = typeof widgetMetricSchema;
