import { z } from 'zod';

export const WIDGET_METRIC_TIME_RANGES = ['day', 'week', 'month', 'year'] as const;
export const WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX = 2;

const widgetMetricSchema = z.object({
  name: z.string().max(25, { message: 'Name must be less than 25 characters.' }).nullable(),
  timeRange: z.enum(WIDGET_METRIC_TIME_RANGES, {
    message: 'Please select a valid time range: day, week, month, or year.',
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
});

export const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(50, { message: 'Title must be less than 50 characters.' }),
  subtitle: z
    .string()
    .max(100, { message: 'Subtitle must be less than 100 characters.' })
    .nullable(),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).nullable(),
  imagePlacement: z.enum(['left', 'right']).default('left'),

  // Styling options
  padding: z
    .number()
    .int()
    .min(0, { message: 'Padding must be 0 or greater.' })
    .max(30, { message: 'Padding must be less than 30.' })
    .default(16),
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
    .default(8),
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
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      message: 'Please enter a valid hex color code for the background.',
    })
    .default('#ffffff'),
  watermark: z.boolean(),

  // Reference fields
  objectiveId: z.string().min(1, { message: 'Objective ID is required.' }),

  // Metrics
  metrics: z
    .array(widgetMetricSchema)
    .max(3, { message: 'Maximum of 3 metrics allowed.' })
    .default([]),
});

export type FormSchema = typeof formSchema;
export type WidgetMetricSchema = typeof widgetMetricSchema;
