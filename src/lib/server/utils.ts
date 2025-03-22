import crypto from 'crypto';
import { error, fail } from '@sveltejs/kit';
import type { Err } from 'neverthrow';
import type { WidgetJoinMetrics } from './db/schema';
import { DrizzleRecordNotFoundErrorCause, type DrizzleError } from './db/types';
import type { SuperValidated } from 'sveltekit-superforms/client';

export function sanitizeUsername(username: string): string {
  return username
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove non-alphanumeric and non -/_ characters
    .replace(/_{2,}/g, '_') // Replace multiple underscores with a single one
    .replace(/-{2,}/g, '-') // Replace multiple dashes with a single one
    .replace(/^[-_]+|[-_]+$/g, ''); // Trim dashes and underscores from start and end
}

/**
 * Generates an ETag for a widget based on its data and metrics
 */
export function generateWidgetEtag(widget: WidgetJoinMetrics): string {
  // Create a string that includes all the widget data that could change
  const widgetData = JSON.stringify({
    // Widget properties
    id: widget.id,
    title: widget.title,
    subtitle: widget.subtitle,
    imageUrl: widget.imageUrl,
    imagePlacement: widget.imagePlacement,
    textIcon: widget.textIcon,

    padding: widget.padding,
    border: widget.border,
    borderWidth: widget.borderWidth,
    borderRadius: widget.borderRadius,
    color: widget.color,
    accentColor: widget.accentColor,
    backgroundColor: widget.backgroundColor,
    watermark: widget.watermark,

    // Metrics (sorted to ensure consistency)
    metrics: widget.metrics
      .sort((a, b) => a.order - b.order)
      .map((metric) => ({
        id: metric.id,
        value: metric.value,
        name: metric.name,
        calculationType: metric.calculationType,
        valueDecimalPrecision: metric.valueDecimalPrecision,
        order: metric.order,
      })),
  } as WidgetJoinMetrics);

  // Use crypto to create a hash
  return crypto.createHash('sha256').update(widgetData).digest('hex');
}

export function handleDbError(result: Err<any, DrizzleError>) {
  if (result.error.cause instanceof DrizzleRecordNotFoundErrorCause) {
    return error(404, result.error.message);
  }
  console.error(result.error);
  return error(500, 'Something went wrong');
}

export function handleFormDbError(result: Err<any, DrizzleError>, form?: SuperValidated<any, any>) {
  if (result.error.cause instanceof DrizzleRecordNotFoundErrorCause) {
    return fail(404, { form, error: result.error.message });
  }
  console.error(result.error);
  return fail(500, { form, error: 'Something went wrong' });
}
