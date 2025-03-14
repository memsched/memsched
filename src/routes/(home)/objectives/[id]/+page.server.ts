import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, type FormSchema } from '$lib/components/forms/objective-form/schema';
import { getUserObjective, updateUserObjective } from '$lib/server/queries';
import type { z } from 'zod';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const objectiveId = event.params.id;
  const targetObjective = await getUserObjective(event.locals.db, objectiveId, event.locals.session.userId);

  if (!targetObjective) {
    return error(404, 'Objective not found');
  }

  const form = await superValidate(zod(formSchema));
  form.data = {
    name: targetObjective.name,
    description: targetObjective.description,
    startValue: targetObjective.startValue,
    unit: targetObjective.unit as z.infer<FormSchema>['unit'],
    visibility: targetObjective.visibility as z.infer<FormSchema>['visibility'],
    goalType: targetObjective.goalType as z.infer<FormSchema>['goalType'],
    endValue: targetObjective.endValue,
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
    const updateResult = await updateUserObjective(
      event.locals.db,
      objectiveId,
      form.data,
      event.locals.session.userId
    );

    if (!updateResult) {
      return error(404, 'Objective not found');
    }

    return message(form, 'Objective successfully updated!');
  },
};
