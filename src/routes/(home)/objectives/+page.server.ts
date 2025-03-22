import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { logSchema } from '$lib/components/forms/objective-log-form/schema';
import { MAX_WIDGETS_PER_USER, MAX_OBJECTIVES_PER_USER } from '$lib/server/constants';
import { handleDbError } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      objectives: [],
      widgetsLimitReached: false,
      maxWidgets: MAX_WIDGETS_PER_USER,
      objectivesLimitReached: false,
      maxObjectives: MAX_OBJECTIVES_PER_USER,
    };
  }

  const isArchived = event.url.searchParams.get('archived') !== null;
  const isCompleted = event.url.searchParams.get('completed') !== null;

  let objectivesResult;

  if (isCompleted) {
    objectivesResult = await event.locals.objectivesService.getUserCompletedObjectives(
      event.locals.session.userId
    );
  } else if (isArchived) {
    objectivesResult = await event.locals.objectivesService.getUserArchivedObjectives(
      event.locals.session.userId
    );
  } else {
    objectivesResult = await event.locals.objectivesService.getUserActiveObjectives(
      event.locals.session.userId
    );
  }

  if (objectivesResult.isErr()) {
    return handleDbError(objectivesResult);
  }

  const objectives = objectivesResult.value;

  // Check if user has reached the widget limit
  const widgetCountResult = await event.locals.widgetsService.getUserWidgetCount(
    event.locals.session.userId
  );
  if (widgetCountResult.isErr()) {
    return handleDbError(widgetCountResult);
  }

  const widgetsLimitReached =
    widgetCountResult.value >= MAX_WIDGETS_PER_USER && !event.locals.user?.admin;

  // Check if user has reached the objectives limit
  const objectivesLimitReached =
    objectives.length >= MAX_OBJECTIVES_PER_USER && !event.locals.user?.admin;

  return {
    objectives,
    form: await superValidate(zod(logSchema)),
    isArchived,
    isCompleted,
    widgetsLimitReached,
    maxWidgets: MAX_WIDGETS_PER_USER,
    objectivesLimitReached,
    maxObjectives: MAX_OBJECTIVES_PER_USER,
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

    const result = await event.locals.objectiveLogsService.logObjectiveProgress(
      form.data,
      userId,
      event.locals.cache
    );

    if (result.isErr()) {
      return handleDbError(result);
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

    const result = await event.locals.objectiveLogsService.undoObjectiveLog(
      objectiveId,
      userId,
      event.locals.cache
    );

    if (result.isErr()) {
      return handleDbError(result);
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

    const result = await event.locals.objectivesService.toggleArchivedObjective(
      objectiveId,
      event.locals.session.userId
    );

    if (result.isErr()) {
      return handleDbError(result);
    }

    return {
      success: true,
      message: archived ? 'Objective unarchived' : 'Objective archived',
    };
  },
};
