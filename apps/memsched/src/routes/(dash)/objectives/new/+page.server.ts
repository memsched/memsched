import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { formSchema } from '$lib/components/forms/objective-form/schema';
import { handleDbError, handleFormDbError } from '$lib/server/utils';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  // Check if user has reached the objective limit
  const objectivesResult = await event.locals.objectivesService.getAllActive(
    event.locals.session.userId
  );
  if (objectivesResult.isErr()) {
    return handleDbError(objectivesResult);
  }
  const objectives = objectivesResult.value;

  const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
  if (planLimits.isErr()) {
    return handleDbError(planLimits);
  }

  const objectivesLimitReached = objectives.length >= planLimits.value.maxObjectives;

  if (objectivesLimitReached) {
    return {
      form: await superValidate(zod4(formSchema)),
      objectivesLimitReached,
      maxObjectives: planLimits.value.maxObjectives,
    };
  }

  return {
    form: await superValidate(zod4(formSchema)),
    objectivesLimitReached: false,
    maxObjectives: planLimits.value.maxObjectives,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    // Check if user has reached the objective limit
    const objectivesResult = await event.locals.objectivesService.getAllActive(
      event.locals.session.userId
    );
    if (objectivesResult.isErr()) {
      return handleDbError(objectivesResult);
    }
    const objectives = objectivesResult.value;

    const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
    if (planLimits.isErr()) {
      return handleDbError(planLimits);
    }

    if (objectives.length >= planLimits.value.maxObjectives) {
      return fail(400, {
        error: `You have reached the maximum limit of ${planLimits.value.maxObjectives} objectives.`,
      });
    }

    const form = await superValidate(event, zod4(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const result = await event.locals.objectivesService.create(
      form.data,
      event.locals.session.userId
    );
    if (result.isErr()) {
      return handleFormDbError(result, form);
    }
    return redirect(302, '/objectives');
  },
};
