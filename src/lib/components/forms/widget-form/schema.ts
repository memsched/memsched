import { z } from 'zod';

export const WIDGET_METRIC_CALCULATION_TYPES = [
  'day',
  'week',
  'month',
  'year',
  'all time',
  'percentage',
] as const;
export const WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX = 2;
export const WIDGET_METRIC_TYPES = ['objective', 'github'] as const;
export const GITHUB_STAT_TYPES = ['commits', 'repositories', 'followers'] as const;

const widgetMetricBaseSchema = z.object({
  name: z
    .string()
    .max(25, { message: 'Name must be less than 25 characters.' })
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  calculationType: z.enum(WIDGET_METRIC_CALCULATION_TYPES, {
    message: 'Please select a valid calculation type.',
  }),
  valueDecimalPrecision: z
    .number({ message: 'Please enter a valid value decimal precision: 0, 1, or 2.' })
    .int({
      message: 'Please select a valid value decimal precision: 0, 1, or 2.',
    })
    .min(0, { message: 'Value decimal precision must be greater than or equal to 0.' })
    .max(WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX, {
      message: 'Value decimal precision must be less than or equal to 2.',
    }),
  metricType: z
    .enum(WIDGET_METRIC_TYPES, {
      message: 'Please select a valid metric type.',
    })
    .default('objective'),
});

const objectiveWidgetMetricSchema = widgetMetricBaseSchema.extend({
  metricType: z.literal('objective'),
  objectiveId: z.string().min(1, { message: 'Objective is required.' }),
  githubUsername: z.string().optional().nullable(),
  githubStatType: z.enum(GITHUB_STAT_TYPES).optional().nullable(),
});

const githubWidgetMetricSchema = widgetMetricBaseSchema.extend({
  metricType: z.literal('github'),
  githubUsername: z.string().min(1, { message: 'GitHub username is required.' }),
  githubStatType: z.enum(GITHUB_STAT_TYPES).default('commits'),
  objectiveId: z.string().optional().nullable(),
});

export const widgetMetricSchema = z.discriminatedUnion('metricType', [
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
    .max(100, { message: 'Subtitle must be less than 100 characters.' })
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  imageUrl: z
    .string()
    .url({ message: 'Please enter a valid image URL.' })
    .refine((url) => !url || url.toLowerCase().endsWith('.svg'), {
      message: 'Image URL must end with .svg',
    })
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  textIcon: z
    .string()
    .max(2, { message: 'Text icon must be 1-2 characters.' })
    .regex(/^[A-Z]{1,2}$/, { message: 'Text icon must be 1-2 capital letters.' })
    .nullable()
    .transform((v) => (v === '' ? null : v)),
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
  border: z.boolean().default(true),
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
