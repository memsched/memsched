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
