import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/components/forms/widget-form/schema';
import type { LocalUser } from '$lib/types';
import {
  createUserWidget,
  getObjectiveFromWidgetId,
  getUserWidgetCount,
} from '$lib/server/queries';
import type { Objective } from '$lib/server/db/schema';
import { MAX_WIDGETS_PER_USER } from '$lib/server/constants';

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

    try {
      // Check if user has reached the widget limit
      const widgetCount = await getUserWidgetCount(event.locals.db, event.locals.session.userId);
      if (widgetCount >= MAX_WIDGETS_PER_USER) {
        return fail(400, {
          form,
          widgetLimitReached: true,
          message: `You've reached the maximum limit of ${MAX_WIDGETS_PER_USER} widgets.`,
        });
      }

      const widgetId = await createUserWidget(
        event.locals.db,
        form.data,
        event.locals.session.userId
      );
      const objective = (await getObjectiveFromWidgetId(event.locals.db, widgetId)) as Objective;

      if (objective.visibility !== 'public') {
        return redirect(302, `/widgets`);
      }
      return redirect(302, `/widgets/new/${widgetId}`);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        return error(404, err.message);
      }
      throw err;
    }
  },
};
