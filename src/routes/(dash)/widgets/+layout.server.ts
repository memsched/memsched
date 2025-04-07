import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const objectives = await event.locals.objectivesService.getAll(event.locals.session.userId);
  if (objectives.isErr()) {
    return {
      objectives: [],
    };
  }

  return {
    objectives: objectives.value,
  };
};
