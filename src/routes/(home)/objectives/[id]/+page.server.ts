import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, type FormSchema } from '$lib/components/forms/objective-form/schema';
import type { z } from 'zod';
import { handleDbError, handleFormDbError } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const objectiveId = event.params.id;
  const objectiveResult = await event.locals.objectivesService.getUserObjective(
    objectiveId,
    event.locals.session.userId
  );

  if (objectiveResult.isErr()) {
    return handleDbError(objectiveResult);
  }

  const objective = objectiveResult.value;

  const form = await superValidate(zod(formSchema));
  form.data = {
    name: objective.name,
    description: objective.description,
    startValue: objective.startValue,
    unit: objective.unit as z.infer<FormSchema>['unit'],
    visibility: objective.visibility as z.infer<FormSchema>['visibility'],
    goalType: objective.goalType as z.infer<FormSchema>['goalType'],
    endValue: objective.endValue,
  };

  return {
    form,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const objectiveId = event.params.id;
    const updateResult = await event.locals.objectivesService.updateUserObjective(
      objectiveId,
      form.data,
      event.locals.session.userId
    );

    if (updateResult.isErr()) {
      return handleFormDbError(updateResult, form);
    }

    return message(form, 'Objective successfully updated!');
  },
};
