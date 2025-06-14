import { error, redirect } from '@sveltejs/kit';

import { authLimiter } from '$lib/server/rate-limiter';
import { handleDbError } from '$lib/server/utils';

import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    // Apply rate limiting to prevent abuse
    if (await authLimiter.isLimited(event)) {
      throw error(429, 'Too many requests. Please try again later.');
    }

    if (event.locals.session === null) {
      return error(401, 'Unauthorized');
    }
    const result = await event.locals.sessionsService.invalidateSession(event.locals.session.id);
    if (result.isErr()) {
      return handleDbError(result);
    }
    event.locals.sessionsService.deleteSessionTokenCookie(event);
    return redirect(302, '/');
  },
};
