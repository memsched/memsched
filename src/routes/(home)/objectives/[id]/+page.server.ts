import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eq, and } from 'drizzle-orm';
import { formSchema, type FormSchema } from '$lib/components/forms/objective-form/schema';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';
import type { z } from 'zod';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const objectiveId = event.params.id;
  const objectives = await db
    .select()
    .from(objective)
    .where(and(eq(objective.id, objectiveId), eq(objective.userId, event.locals.session.userId)));

  if (objectives.length === 0) {
    return error(404, 'Objective not found');
  }

  const form = await superValidate(zod(formSchema));
  const ob = objectives[0];
  form.data = {
    name: ob.name,
    description: ob.description,
    startValue: ob.startValue,
    unit: ob.unit as z.infer<FormSchema>['unit'],
    visibility: ob.visibility as z.infer<FormSchema>['visibility'],
    goalType: ob.goalType as z.infer<FormSchema>['goalType'],
    endValue: ob.endValue,
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

    const objectives = await db
      .select()
      .from(objective)
      .where(
        and(eq(objective.id, event.params.id), eq(objective.userId, event.locals.session.userId))
      );

    if (objectives.length === 0) {
      return error(404, 'Objective not found');
    }

    const objectiveId = event.params.id;
    await db
      .update(objective)
      .set({
        name: form.data.name,
        description: form.data.description,
        unit: form.data.unit,
        visibility: form.data.visibility,
        endValue: form.data.endValue,
      })
      .where(and(eq(objective.id, objectiveId), eq(objective.userId, event.locals.session.userId)));

    return message(form, 'Objective sucessfully updated!');
  },
};
