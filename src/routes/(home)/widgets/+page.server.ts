import type { PageServerLoad } from './$types';
import { ResultAsync } from 'neverthrow';
import { okAsync } from 'neverthrow';
import { handleDbError } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
  const session = event.locals.session;
  if (!session) {
    return {
      widgets: [],
    };
  }

  const res = await event.locals.widgetsService
    .getUserWidgets(session.userId)
    .andThen((widgetsIds) => {
      return ResultAsync.combine([
        okAsync(widgetsIds),
        event.locals.widgetsService.getUserWidgetCount(session.userId),
      ]);
    });
  if (res.isErr()) {
    return handleDbError(res);
  }
  const [widgetIds, widgetCount] = res.value;

  const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
  if (planLimits.isErr()) {
    return handleDbError(planLimits);
  }

  return {
    widgets: widgetIds.map((w) => w.id),
    widgetsLimitReached: widgetCount >= planLimits.value.maxWidgets,
    maxWidgets: planLimits.value.maxWidgets,
  };
};
