import type { PageServerLoad } from './$types';
import { getUserWidgets } from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      widgets: [],
    };
  }

  const isCompleted = event.url.searchParams.get('completed') !== null;
  const widgetIds = await getUserWidgets(event.locals.db, event.locals.session.userId, isCompleted);

  return {
    widgets: widgetIds.map((w) => w.id),
    isCompleted,
  };
};
