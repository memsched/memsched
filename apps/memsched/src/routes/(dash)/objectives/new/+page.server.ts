/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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
      form: await superValidate(zod(formSchema)),
      objectivesLimitReached,
      maxObjectives: planLimits.value.maxObjectives,
    };
  }

  return {
    form: await superValidate(zod(formSchema)),
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

    const form = await superValidate(event, zod(formSchema));

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
