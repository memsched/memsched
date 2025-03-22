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

  const objective = await event.locals.objectivesService.getUserObjective(
    config.objectiveId,
    event.locals.session.userId
  );
  if (objective.isErr()) {
    return handleDbError(objective);
  }

  // Calculate metric values using proper calculation method
  const metricValuesResult = await event.locals.metricsService.computePreviewMetricValues(
    objective.value.id,
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
