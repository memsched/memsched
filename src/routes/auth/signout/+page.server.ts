import type { Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/session';

export const actions: Actions = {
  default: async (event) => {
    if (event.locals.session === null) {
      return error(401, 'Unauthorized');
    }
    await invalidateSession(event.locals.db, event.locals.session.id);
    deleteSessionTokenCookie(event);
    return redirect(302, '/');
  },
};
