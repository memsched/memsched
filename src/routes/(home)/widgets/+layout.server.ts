import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      objectives: [],
    };
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
