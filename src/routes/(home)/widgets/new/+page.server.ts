import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/components/forms/widget-form/schema';
import type { LocalUser } from '$lib/types';
import { MAX_WIDGETS_PER_USER } from '$lib/server/constants';
import { handleFormDbError } from '$lib/server/utils';
import { ResultAsync, okAsync } from 'neverthrow';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const form = await superValidate(zod(formSchema));
  const objectiveId = event.url.searchParams.get('objectiveId');

  if (objectiveId) {
    form.data.objectiveId = objectiveId;
  }

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

    const widgetCount = await event.locals.widgetsService.getUserWidgetCount(
      event.locals.session.userId
    );
    if (widgetCount.isErr()) {
      return handleFormDbError(widgetCount, form);
    }
    if (widgetCount.value >= MAX_WIDGETS_PER_USER && !event.locals.user?.admin) {
      return fail(400, {
        form,
        widgetLimitReached: true,
        message: `You've reached the maximum limit of ${MAX_WIDGETS_PER_USER} widgets.`,
      });
    }

    const res = await event.locals.widgetsService
      .createUserWidget(form.data, event.locals.session.userId)
      .andThen((widgetId) =>
        ResultAsync.combine([
          okAsync(widgetId),
          event.locals.objectivesService.getObjectiveFromWidgetId(widgetId),
        ])
      );

    if (res.isErr()) {
      return handleFormDbError(res, form);
    }

    const [widgetId, objective] = res.value;
    if (objective.visibility !== 'public') {
      return redirect(302, `/widgets`);
    }

    return redirect(302, `/widgets/new/${widgetId}`);
  },
};
