import { error, json } from '@sveltejs/kit';
import { okAsync, ResultAsync } from 'neverthrow';
import { z } from 'zod';

import { widgetMetricSchema } from '$lib/components/forms/widget-form/schema';
import { handleDbError } from '$lib/server/utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  if (!event.locals.session || event.params.userId !== event.locals.session.userId) {
    return error(401, 'Unauthorized');
  }

  const userId = event.locals.session.userId;

  const base64Config = event.url.searchParams.get('config');
  if (!base64Config) {
    return error(400, 'Missing widget config');
  }

  let metrics: z.infer<typeof widgetMetricSchema>[];
  try {
    const decodedConfig = JSON.parse(atob(base64Config));
    metrics = z.array(widgetMetricSchema).parse(decodedConfig);
  } catch (_) {
    return error(400, 'Invalid widget config');
  }

  // Get specific metric index if provided
  const metricIndex = event.url.searchParams.get('metricIndex');
  const selectedMetrics = metricIndex !== null ? [metrics[parseInt(metricIndex)]] : metrics;

  // Verify user has access to all objectives referenced in metrics
  const objectiveIds = selectedMetrics
    .map((metric) => metric.objectiveId)
    .filter((id): id is string => Boolean(id));

  // Verify access to all objectives
  const objectiveVerifications = await Promise.all(
    objectiveIds.map((objectiveId) => {
      if (!objectiveId) {
        return okAsync();
      }
      return event.locals.objectivesService.get(objectiveId, userId);
    })
  );

  // Check if any objective verification failed
  for (const verification of objectiveVerifications) {
    if (verification.isErr()) {
      return handleDbError(verification);
    }
  }

  const metricsData = await ResultAsync.combine(
    selectedMetrics.map((metric, i) =>
      event.locals.metricDataService.getData({
        ...metric,
        userId,
        order: metricIndex !== null ? parseInt(metricIndex) + 1 : i + 1,
        id: '',
        createdAt: new Date(),
        widgetId: 'preview',
      })
    )
  );
  if (metricsData.isErr()) {
    return handleDbError(metricsData);
  }

  return json(metricsData.value);
};
