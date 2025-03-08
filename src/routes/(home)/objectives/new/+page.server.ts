import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { v4 as uuidv4 } from 'uuid';
import { formSchema } from '$lib/components/forms/objective-form/schema';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
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

    const userId = event.locals.session.userId;

    await db.transaction(async (tx) => {
      const objective = (
        await tx
          .insert(table.objective)
          .values({
            id: uuidv4(),
            name: form.data.name,
            description: form.data.description,
            startValue: form.data.startValue,
            value: form.data.startValue,
            unit: form.data.unit,
            visibility: form.data.visibility,
            goalType: form.data.goalType,
            endValue: form.data.endValue,
            userId,
          })
          .returning()
      )[0];

      await tx.insert(table.objectiveLog).values({
        id: uuidv4(),
        value: form.data.startValue,
        notes: '',
        loggedAt: new Date(),
        objectiveId: objective.id,
        userId,
      });
    });

    return redirect(302, '/objectives');
  },
};
