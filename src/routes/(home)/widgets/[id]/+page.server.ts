import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, type FormSchema } from '$lib/components/forms/widget-form/schema';
import type { z } from 'zod';
import type { LocalUser } from '$lib/types';
import { handleDbError, handleFormDbError } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const widgetId = event.params.id;
  const widgetResult = await event.locals.widgetsService.getWidgetWithMetrics(
    widgetId,
    event.locals.session.userId
  );
  if (widgetResult.isErr()) {
    return handleDbError(widgetResult);
  }
  const widget = widgetResult.value;

  const form = await superValidate(zod(formSchema));
  form.data = {
    title: widget.title,
    subtitle: widget.subtitle,
    // TODO: Sanitize imageUrl
    imageUrl: widget.imageUrl,
    textIcon: widget.textIcon,
    imagePlacement: widget.imagePlacement as z.infer<FormSchema>['imagePlacement'],

    padding: widget.padding,
    border: widget.border,
    borderWidth: widget.borderWidth,
    borderRadius: widget.borderRadius,
    color: widget.color,
    accentColor: widget.accentColor,
    backgroundColor: widget.backgroundColor,
    watermark: widget.watermark,

    objectiveId: widget.objectiveId,
    metrics: widget.metrics.map((metric) => ({
      name: metric.name,
      calculationType:
        metric.calculationType as z.infer<FormSchema>['metrics'][0]['calculationType'],
      valueDecimalPrecision: metric.valueDecimalPrecision,
    })),
  };

  return {
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
    const widgetId = event.params.id;
    const userId = event.locals.session.userId;

    const result = await event.locals.widgetsService.updateUserWidget(
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
