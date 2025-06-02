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
