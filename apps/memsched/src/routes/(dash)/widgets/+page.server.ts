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
import { redirect } from '@sveltejs/kit';

import { handleDbError } from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = event.locals.session;
  if (!session) {
    return redirect(302, '/auth/signin');
  }

  const res = await event.locals.widgetsService.getAll(session.userId);
  if (res.isErr()) {
    return handleDbError(res);
  }
  const widgets = res.value;

  const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
  if (planLimits.isErr()) {
    return handleDbError(planLimits);
  }

  return {
    widgets: widgets.map((widget) => widget.id),
    widgetsLimitReached: widgets.length >= planLimits.value.maxWidgets,
    maxWidgets: planLimits.value.maxWidgets,
  };
};
