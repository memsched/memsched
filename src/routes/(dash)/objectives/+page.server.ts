import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { logSchema } from '$lib/components/forms/objective-log-form/schema';
import { handleDbError, handleFormDbError } from '$lib/server/utils';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const isArchived = event.url.searchParams.get('archived') !== null;
  const isCompleted = event.url.searchParams.get('completed') !== null;

  let objectivesResult;

  if (isCompleted) {
    objectivesResult = await event.locals.objectivesService.getAllCompleted(
      event.locals.session.userId
    );
  } else if (isArchived) {
    objectivesResult = await event.locals.objectivesService.getAllArchived(
      event.locals.session.userId
    );
  } else {
    objectivesResult = await event.locals.objectivesService.getAllActive(
      event.locals.session.userId
    );
  }

  if (objectivesResult.isErr()) {
    return handleDbError(objectivesResult);
  }

  const objectives = objectivesResult.value;

  const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
  if (planLimits.isErr()) {
    return handleDbError(planLimits);
  }

  // Check if user has reached the objectives limit
  const objectivesLimitReached =
    objectives.length >= planLimits.value.maxObjectives && !event.locals.user?.admin;

  return {
    objectives,
    form: await superValidate(zod(logSchema)),
    isArchived,
    isCompleted,
    objectivesLimitReached,
    maxObjectives: planLimits.value.maxObjectives,
  };
};

export const actions: Actions = {
  log: async (event) => {
    if (!event.locals.session) {
      return redirect(302, '/auth/signin');
    }

    const form = await superValidate(event, zod(logSchema));
    const userId = event.locals.session.userId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const result = await event.locals.objectiveLogsService.log(
      form.data,
      userId,
      event.locals.cache
    );

    if (result.isErr()) {
      return handleFormDbError(result, form);
    }

    const updatedObjective = result.value[0];

    return {
      form,
      success: true,
      message: `Added ${form.data.value} ${updatedObjective.unit}`,
    };
  },

  undoLog: async (event) => {
    if (!event.locals.session) {
      return redirect(302, '/auth/signin');
    }

    const formData = await event.request.formData();
    const objectiveId = formData.get('objectiveId')?.toString();
    const userId = event.locals.session.userId;

    if (!objectiveId) {
      return fail(400, { error: 'Objective ID is required' });
    }

    const result = await event.locals.objectiveLogsService.undoLog(
      objectiveId,
      userId,
      event.locals.cache
    );

    if (result.isErr()) {
      return handleFormDbError(result);
    }

    const removedLog = result.value[1];

    return {
      success: true,
      message: `Undid log of ${removedLog.value}`,
    };
  },

  toggleArchive: async (event) => {
    if (!event.locals.session) {
      return redirect(302, '/auth/signin');
    }

    const formData = await event.request.formData();
    const objectiveId = formData.get('objectiveId')?.toString();
    const archived = formData.get('archived') === 'true';

    if (!objectiveId) {
      return fail(400, { error: 'Objective ID is required' });
    }

    const result = await event.locals.objectivesService.toggleArchived(
      objectiveId,
      event.locals.session.userId
    );

    if (result.isErr()) {
      return handleFormDbError(result);
    }

    return {
      success: true,
      message: archived ? 'Objective unarchived' : 'Objective archived',
    };
  },
};
