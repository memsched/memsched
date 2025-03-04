import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/components/forms/objective-form/schema';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/signin');
  }
  return {
    form: await superValidate(zod(formSchema)),
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

    await db.insert(objective).values({
      name: form.data.name,
      description: form.data.description,
      startValue: form.data.startValue,
      value: form.data.startValue,
      unit: form.data.unit,
      visibility: form.data.visibility,
      goalType: form.data.goalType,
      endValue: form.data.endValue,
      userId: event.locals.session.userId,
    });
    return redirect(302, '/objectives');
  },
};
