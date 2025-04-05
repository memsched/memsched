import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const objectives = await event.locals.objectivesService.getUserObjectives(
    event.locals.session.userId
  );
  if (objectives.isErr()) {
    return {
      objectives: [],
    };
  }

  return {
    objectives: objectives.value,
  };
};
