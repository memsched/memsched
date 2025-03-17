import type { Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/session';
import { authLimiter } from '$lib/server/rate-limiter';

export const actions: Actions = {
  default: async (event) => {
    // Apply rate limiting to prevent abuse
    if (await authLimiter.isLimited(event)) {
      throw error(429, 'Too many requests. Please try again later.');
    }

    if (event.locals.session === null) {
      return error(401, 'Unauthorized');
    }
    await invalidateSession(event.locals.db, event.locals.session.id);
    deleteSessionTokenCookie(event);
    return redirect(302, '/');
  },
};
