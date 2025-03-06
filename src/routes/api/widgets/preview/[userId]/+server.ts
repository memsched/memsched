import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { objective, type WidgetJoinMetricsPreview } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { formSchema } from '$lib/components/forms/widget-form/schema';
import Widget from '$lib/components/Widget.svelte';
import { renderWidget } from '$lib/server/svg';

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
  } catch (e) {
    return error(400, 'Invalid widget config');
  }

  const objectives = await db.select().from(objective).where(eq(objective.id, config.objectiveId));
  if (objectives.length === 0 || objectives[0].visibility !== 'public') {
    return error(404, 'Objective not found');
  }
  const ob = objectives[0];

  // TODO: Sanitize imageUrl
  const props = {
    ...config,
    metrics: config.metrics.map((metric, i) => ({
      ...metric,
      order: i + 1,
      value: ob.value,
    })),
  };

  return renderWidget<WidgetJoinMetricsPreview>(event, Widget, props, true);
};
