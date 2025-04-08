import { error, json } from '@sveltejs/kit';
import { okAsync, ResultAsync } from 'neverthrow';

import { formSchema } from '$lib/components/forms/widget-form/schema';
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
  let config;
  try {
    const decodedConfig = JSON.parse(atob(base64Config));
    config = formSchema.parse(decodedConfig);
  } catch (_) {
    return error(400, 'Invalid widget config');
  }

  // Verify user has access to all objectives referenced in metrics
  const objectiveIds = config.metrics.map((metric) => metric.objectiveId).filter(Boolean);

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

  const metrics = config.metrics;
  const metricsData = await ResultAsync.combine(
    metrics.map((metric, i) =>
      event.locals.metricDataService.getData({
        ...metric,
        userId,
        order: i + 1,
        id: '',
        createdAt: new Date(),
        widgetId: 'preview',
        valuePercent: false,
      })
    )
  );
  if (metricsData.isErr()) {
    return handleDbError(metricsData);
  }

  return json({
    metrics: metrics.map((metric, i) => ({
      ...metric,
      data: metricsData.value[i],
      valuePercent: false,
      order: i + 1,
    })),
  });
};
