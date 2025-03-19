import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { deleteUserWidget } from '$lib/server/queries';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }
    const widgetId = (await event.request.formData()).get('widgetId') as string;
    const deleted = await deleteUserWidget(
      event.locals.db,
      widgetId,
      event.locals.session.userId,
      event.locals.cache
    );

    if (!deleted) {
      return error(404, 'Widget not found');
    }

    return redirect(302, '/widgets');
  },
};
