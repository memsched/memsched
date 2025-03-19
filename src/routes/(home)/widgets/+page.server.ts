import type { PageServerLoad } from './$types';
import { getUserWidgets, getUserWidgetCount } from '$lib/server/queries';
import { MAX_WIDGETS_PER_USER } from '$lib/server/constants';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      widgets: [],
    };
  }

  const isCompleted = event.url.searchParams.get('completed') !== null;
  const widgetIds = await getUserWidgets(event.locals.db, event.locals.session.userId, isCompleted);

  // Check if user has reached the widget limit
  const widgetCount = await getUserWidgetCount(event.locals.db, event.locals.session.userId);
  const widgetsLimitReached = widgetCount >= MAX_WIDGETS_PER_USER && !event.locals.user?.admin;

  return {
    widgets: widgetIds.map((w) => w.id),
    isCompleted,
    widgetsLimitReached,
    maxWidgets: MAX_WIDGETS_PER_USER,
  };
};
