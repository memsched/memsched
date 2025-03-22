import type { PageServerLoad } from './$types';
import { MAX_WIDGETS_PER_USER } from '$lib/server/constants';
import { ResultAsync } from 'neverthrow';
import { okAsync } from 'neverthrow';

export const load: PageServerLoad = async (event) => {
  const session = event.locals.session;
  if (!session) {
    return {
      widgets: [],
    };
  }

  const isCompleted = event.url.searchParams.get('completed') !== null;
  const res = await event.locals.widgetsService
    .getUserWidgets(session.userId, isCompleted)
    .andThen((widgetsIds) => {
      return ResultAsync.combine([
        okAsync(widgetsIds),
        event.locals.widgetsService.getUserWidgetCount(session.userId),
      ]);
    });
  if (res.isErr()) {
    return {
      widgets: [],
    };
  }
  const [widgetIds, widgetCount] = res.value;

  return {
    widgets: widgetIds.map((w) => w.id),
    isCompleted,
    widgetsLimitReached: widgetCount >= MAX_WIDGETS_PER_USER && !event.locals.user?.admin,
    maxWidgets: MAX_WIDGETS_PER_USER,
  };
};
