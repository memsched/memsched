import { error, fail, redirect } from '@sveltejs/kit';
import { okAsync, ResultAsync } from 'neverthrow';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { formSchema } from '$lib/components/forms/widget-form/schema';
import { handleDbError, handleFormDbError } from '$lib/server/utils';
import type { LocalUser } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = event.locals.session;
  if (!session) {
    return redirect(302, '/auth/signin');
  }

  const widgetId = event.params.id;
  const res = await event.locals.widgetsService
    .getWithMetrics(widgetId, session.userId)
    .andThen((widget) =>
      ResultAsync.combine([okAsync(widget), event.locals.objectivesService.getAll(session.userId)])
    );
  if (res.isErr()) {
    return handleDbError(res);
  }
  const [widget, objectives] = res.value;

  const form = await superValidate(zod(formSchema));
  form.data = widget as any;

  form.data.metrics = widget.metrics.map((metric) => ({
    ...metric,
    valuePeriod: metric.valuePeriod ?? 'day',
    valueDisplayPrecision: metric.valueDisplayPrecision ?? 0,
    valuePercent: metric.valuePercent ?? false,
    plotPeriod: metric.plotPeriod ?? 'week',
    plotInterval: metric.plotInterval ?? 'day',
    heatmapPeriod: metric.heatmapPeriod ?? 'month',
    heatmapInterval: metric.heatmapInterval ?? 'day',
  })) as any;

  return {
    objectives,
    form,
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    if (form.data.imageUrl && !form.data.imageUrl.startsWith(event.url.origin)) {
      return fail(400, {
        form,
        error: 'Invalid image URL',
      });
    }

    const isTitleSafe = await event.locals.moderationService.isTextSafe(form.data.title);
    if (isTitleSafe.isErr()) {
      return handleFormDbError(isTitleSafe, form);
    }
    if (!isTitleSafe.value) {
      setError(form, 'title', 'This title is not allowed.');
      return fail(400, { form });
    }
    const isSubtitleSafe = await event.locals.moderationService.isTextSafe(form.data.subtitle);
    if (isSubtitleSafe.isErr()) {
      return handleFormDbError(isSubtitleSafe, form);
    }
    if (!isSubtitleSafe.value) {
      setError(form, 'subtitle', 'This subtitle is not allowed.');
      return fail(400, { form });
    }

    const widgetId = event.params.id;
    const userId = event.locals.session.userId;

    const result = await event.locals.widgetsService.update(
      widgetId,
      form.data,
      userId,
      event.locals.cache
    );
    if (result.isErr()) {
      return handleFormDbError(result, form);
    }

    return message(form, 'Widget successfully updated!');
  },
};
