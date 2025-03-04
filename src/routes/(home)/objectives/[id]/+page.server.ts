import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';
import { formSchema, type FormSchema } from '$lib/components/forms/objective-form/schema';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';
import type { z } from 'zod';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/signin');
  }

  const objectiveId = parseInt(event.params.id);
  if (isNaN(objectiveId)) {
    return error(404, 'Objective not found');
  }

  const objectives = await db
    .select()
    .from(objective)
    .where(eq(objective.id, objectiveId))
    .limit(1);

  if (objectives.length === 0) {
    return error(404, 'Objective not found');
  }

  const form = await superValidate(zod(formSchema));
  const o = objectives[0];
  form.data = {
    name: o.name,
    description: o.description,
    startValue: o.startValue,
    unit: o.unit as z.infer<FormSchema>['unit'],
    visibility: o.visibility as z.infer<FormSchema>['visibility'],
    goalType: o.goalType as z.infer<FormSchema>['goalType'],
    endValue: o.endValue,
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

    const objectiveId = parseInt(event.params.id);
    if (isNaN(objectiveId)) {
      return error(404, 'Objective not found');
    }

    await db
      .update(objective)
      .set({
        name: form.data.name,
        description: form.data.description,
        unit: form.data.unit,
        visibility: form.data.visibility,
        endValue: form.data.endValue,
      })
      .where(eq(objective.id, objectiveId));

    return message(form, 'Objective sucessfully updated!');
  },
};
