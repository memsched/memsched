import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
  getUserActiveObjectives,
  getUserCompletedObjectives,
  getUserArchivedObjectives,
  toggleArchivedObjective,
  logObjectiveProgress,
  undoObjectiveLog,
  getUserWidgetCount,
} from '$lib/server/queries';
import { logSchema } from '$lib/components/forms/objective-log-form/schema';
import * as schema from '$lib/server/db/schema';
import { MAX_WIDGETS_PER_USER, MAX_OBJECTIVES_PER_USER } from '$lib/server/constants';

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

  let objectives;

  if (isCompleted) {
    objectives = await getUserCompletedObjectives(event.locals.db, event.locals.session.userId);
  } else if (isArchived) {
    objectives = await getUserArchivedObjectives(event.locals.db, event.locals.session.userId);
  } else {
    objectives = await getUserActiveObjectives(event.locals.db, event.locals.session.userId);
  }

  // Check if user has reached the widget limit
  const widgetCount = await getUserWidgetCount(event.locals.db, event.locals.session.userId);
  const widgetsLimitReached = widgetCount >= MAX_WIDGETS_PER_USER && !event.locals.user?.admin;

  // Check if user has reached the objectives limit
  const objectivesCount = objectives.length;
  const objectivesLimitReached =
    objectivesCount >= MAX_OBJECTIVES_PER_USER && !event.locals.user?.admin;

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

    try {
      const updatedObjective = (await logObjectiveProgress(
        event.locals.db,
        form.data,
        userId,
        event.locals.cache
      )) as typeof schema.objective.$inferSelect | null;

      if (!updatedObjective) {
        return fail(404, {
          form,
          error: 'Objective not found',
        });
      }

      return {
        form,
        success: true,
        message: `Added ${form.data.value} ${updatedObjective.unit}`,
      };
    } catch (error) {
      console.error('Error logging objective progress:', error);
      return fail(500, {
        form,
        error: 'Failed to log progress',
      });
    }
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

    try {
      const removedLog = (await undoObjectiveLog(
        event.locals.db,
        objectiveId,
        userId,
        event.locals.cache
      )) as typeof schema.objectiveLog.$inferSelect | null;

      if (!removedLog) {
        return fail(404, { error: 'No logs found to undo' });
      }

      return {
        success: true,
        message: `Undid log of ${removedLog.value}`,
      };
    } catch (error) {
      console.error('Error undoing objective log:', error);
      return fail(500, { error: 'Failed to undo log' });
    }
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

    try {
      await toggleArchivedObjective(event.locals.db, objectiveId, event.locals.session.userId);

      return {
        success: true,
        message: archived ? 'Objective unarchived' : 'Objective archived',
      };
    } catch (error) {
      console.error('Error toggling objective archive status:', error);
      return fail(500, { error: 'Failed to update objective' });
    }
  },
};
