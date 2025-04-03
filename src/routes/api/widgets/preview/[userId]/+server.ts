import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { type WidgetJoinMetricsPreview } from '$lib/server/db/schema';
import { formSchema } from '$lib/components/forms/widget-form/schema';
import Widget from '$lib/components/Widget.svelte';
import { renderWidget } from '$lib/server/svg';
import { handleDbError } from '$lib/server/utils';

export const GET: RequestHandler = async (event) => {
  if (!event.locals.session || event.params.userId !== event.locals.session.userId) {
    return error(401, 'Unauthorized');
  }

  const userId = event.locals.session.userId;

  const base64Config = event.url.searchParams.get('config');
  if (!base64Config) {
    return error(400, 'Missing widget config');
  }
  let config;
  try {
    const decodedConfig = JSON.parse(atob(base64Config));
    config = formSchema.parse(decodedConfig);
  } catch (_) {
    return error(400, 'Invalid widget config');
  }

  // Verify user has access to all objectives referenced in metrics
  const objectiveIds = config.metrics.map((metric) => metric.objectiveId).filter(Boolean);

  if (objectiveIds.length === 0) {
    // No metrics with objectives, render widget without metrics
    const props = {
      ...config,
      metrics: [],
    };
    return renderWidget<WidgetJoinMetricsPreview>(event, Widget, props, true);
  }

  // Verify access to all objectives
  const objectiveVerifications = await Promise.all(
    objectiveIds.map((objectiveId) =>
      event.locals.objectivesService.getUserObjective(objectiveId, userId)
    )
  );

  // Check if any objective verification failed
  for (const verification of objectiveVerifications) {
    if (verification.isErr()) {
      return handleDbError(verification);
    }
  }

  // Calculate metric values using proper calculation method
  const metricValuesResult = await event.locals.metricsService.computePreviewMetricValues(
    config.metrics
  );

  if (metricValuesResult.isErr()) {
    return handleDbError(metricValuesResult);
  }

  const metricsValues = metricValuesResult.value.map((metric, i) => ({
    ...config.metrics[i],
    order: i + 1,
    value: metric,
  }));

  // TODO: Sanitize imageUrl
  const props = {
    ...config,
    metrics: metricsValues,
  };

  return renderWidget<WidgetJoinMetricsPreview>(event, Widget, props, true);
};
