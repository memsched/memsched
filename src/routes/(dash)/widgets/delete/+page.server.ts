import { error, redirect } from '@sveltejs/kit';

import { handleDbError } from '$lib/server/utils';

import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }
    const widgetId = (await event.request.formData()).get('widgetId') as string;
    const deleted = await event.locals.widgetsService.deleteUserWidget(
      widgetId,
      event.locals.session.userId,
      event.locals.cache
    );

    if (deleted.isErr()) {
      return handleDbError(deleted);
    }

    return redirect(302, '/widgets');
  },
};
