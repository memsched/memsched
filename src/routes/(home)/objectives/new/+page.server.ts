import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/components/forms/objective-form/schema';
import { createUserObjective, getUserActiveObjectives } from '$lib/server/queries';
import { MAX_OBJECTIVES_PER_USER } from '$lib/server/constants';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  // Check if user has reached the objective limit
  const objectives = await getUserActiveObjectives(event.locals.db, event.locals.session.userId);
  const objectivesLimitReached = objectives.length >= MAX_OBJECTIVES_PER_USER;

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
    const objectives = await getUserActiveObjectives(event.locals.db, event.locals.session.userId);
    const objectivesLimitReached = objectives.length >= MAX_OBJECTIVES_PER_USER;

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

    try {
      await createUserObjective(event.locals.db, form.data, event.locals.session.userId);
    } catch (err) {
      console.error('Error creating objective:', err);
      return fail(500, {
        form,
        error: 'Failed to create objective',
      });
    }
    return redirect(302, '/objectives');
  },
};
