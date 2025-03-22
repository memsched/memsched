import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/components/forms/objective-form/schema';
import { MAX_OBJECTIVES_PER_USER } from '$lib/server/constants';
import { handleDbError, handleFormDbError } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  // Check if user has reached the objective limit
  const objectivesResult = await event.locals.objectivesService.getUserActiveObjectives(
    event.locals.session.userId
  );
  if (objectivesResult.isErr()) {
    return handleDbError(objectivesResult);
  }
  const objectives = objectivesResult.value;
  const objectivesLimitReached =
    objectives.length >= MAX_OBJECTIVES_PER_USER && !event.locals.user?.admin;

  if (objectivesLimitReached) {
    return {
      form: await superValidate(zod(formSchema)),
      objectivesLimitReached,
      maxObjectives: MAX_OBJECTIVES_PER_USER,
    };
  }

  return {
    form: await superValidate(zod(formSchema)),
    objectivesLimitReached: false,
    maxObjectives: MAX_OBJECTIVES_PER_USER,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    // Check if user has reached the objective limit
    const objectivesResult = await event.locals.objectivesService.getUserActiveObjectives(
      event.locals.session.userId
    );
    if (objectivesResult.isErr()) {
      return handleDbError(objectivesResult);
    }
    const objectives = objectivesResult.value;
    const objectivesLimitReached =
      objectives.length >= MAX_OBJECTIVES_PER_USER && !event.locals.user?.admin;

    if (objectivesLimitReached) {
      return fail(400, {
        error: `You have reached the maximum limit of ${MAX_OBJECTIVES_PER_USER} objectives.`,
      });
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const result = await event.locals.objectivesService.createUserObjective(
      form.data,
      event.locals.session.userId
    );
    if (result.isErr()) {
      return handleFormDbError(result, form);
    }
    return redirect(302, '/objectives');
  },
};
