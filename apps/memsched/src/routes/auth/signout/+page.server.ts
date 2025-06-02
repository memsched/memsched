/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
