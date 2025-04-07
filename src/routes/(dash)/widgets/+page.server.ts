import { redirect } from '@sveltejs/kit';
import { ResultAsync } from 'neverthrow';
import { okAsync } from 'neverthrow';

import { handleDbError } from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = event.locals.session;
  if (!session) {
    return redirect(302, '/auth/signin');
  }

  const res = await event.locals.widgetsService.getAll(session.userId).andThen((widgets) => {
    return ResultAsync.combine([
      okAsync(widgets),
      event.locals.widgetsService.getUserWidgetCount(session.userId),
    ]);
  });
  if (res.isErr()) {
    return handleDbError(res);
  }
  const [widgets, widgetCount] = res.value;

  const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
  if (planLimits.isErr()) {
    return handleDbError(planLimits);
  }

  return {
    widgets: widgets.map((widget) => widget.id),
    widgetsLimitReached: widgetCount >= planLimits.value.maxWidgets,
    maxWidgets: planLimits.value.maxWidgets,
  };
};
