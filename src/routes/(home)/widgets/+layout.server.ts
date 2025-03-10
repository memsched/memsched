import type { LayoutServerLoad } from './$types';
import { getUserObjectives } from '$lib/server/queries';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      objectives: [],
    };
  }

  return {
    objectives: await getUserObjectives(event.locals.session.userId),
  };
};
