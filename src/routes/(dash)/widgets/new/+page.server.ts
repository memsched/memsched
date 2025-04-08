import { error, fail, redirect } from '@sveltejs/kit';
import { okAsync } from 'neverthrow';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { formSchema } from '$lib/components/forms/widget-form/schema';
import { handleDbError, handleFormDbError } from '$lib/server/utils';
import type { LocalUser } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }
  const objectivesResult = await event.locals.objectivesService.getAll(event.locals.session.userId);
  if (objectivesResult.isErr()) {
    return handleDbError(objectivesResult);
  }
  const objectives = objectivesResult.value;

  const form = await superValidate(zod(formSchema));

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

    const widgetCount = await event.locals.widgetsService.getUserWidgetCount(
      event.locals.session.userId
    );
    if (widgetCount.isErr()) {
      return handleFormDbError(widgetCount, form);
    }

    const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
    if (planLimits.isErr()) {
      return handleFormDbError(planLimits, form);
    }

    if (widgetCount.value >= planLimits.value.maxWidgets) {
      return fail(400, {
        form,
        widgetLimitReached: true,
        message: `You've reached the maximum limit of ${planLimits.value.maxWidgets} widgets.`,
      });
    }

    const res = await event.locals.widgetsService
      .create(form.data, event.locals.session.userId)
      .andThen((widgetId) => okAsync(widgetId));

    if (res.isErr()) {
      return handleFormDbError(res, form);
    }

    const widgetId = res.value;
    if (form.data.visibility !== 'public') {
      return redirect(302, `/widgets`);
    }

    return redirect(302, `/widgets/new/${widgetId}`);
  },
};
