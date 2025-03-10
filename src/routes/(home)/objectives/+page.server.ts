import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { desc, eq, and, or, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateObjectiveWidgetMetrics } from '$lib/server/queries';
import { logSchema } from '$lib/components/forms/objective-log-form/schema';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      objectives: [],
    };
  }
  
  // Check which view we're loading
  const isArchived = event.url.searchParams.get('archived') !== null;
  const isCompleted = event.url.searchParams.get('completed') !== null;
  
  // Base query for user's objectives
  let conditions = and(eq(table.objective.userId, event.locals.session.userId));
  
  if (isCompleted) {
    // For completed view: show fixed objectives where value >= endValue and not archived
    conditions = and(
      conditions,
      eq(table.objective.archived, false),
      eq(table.objective.goalType, 'fixed'),
      // Only include objectives where current value meets or exceeds the end value
      // and end value is not null
      sql`${table.objective.value} >= ${table.objective.endValue} AND ${table.objective.endValue} IS NOT NULL`
    );
  } else {
    // For active/archived views: filter by archived status
    conditions = and(conditions, eq(table.objective.archived, isArchived));
    
    if (!isArchived) {
      // For active view: exclude completed fixed objectives
      conditions = and(
        conditions,
        or(
          eq(table.objective.goalType, 'ongoing'),
          sql`${table.objective.value} < ${table.objective.endValue} OR ${table.objective.endValue} IS NULL`
        )
      );
    }
  }
  
  const objectives = await db
    .select()
    .from(table.objective)
    .where(conditions)
    .orderBy(desc(table.objective.createdAt));
  
  return {
    objectives,
    form: await superValidate(zod(logSchema)),
    isArchived,
    isCompleted,
  };
};

// Schema for undoing the last log
const undoLogSchema = z.object({
  objectiveId: z.string().min(1, 'Objective ID is required'),
});

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
      // First, get the objective to verify ownership
      const objectives = await db
        .select()
        .from(table.objective)
        .where(
          and(eq(table.objective.id, form.data.objectiveId), eq(table.objective.userId, userId))
        );

      if (objectives.length === 0) {
        return fail(404, {
          form,
          error: 'Objective not found',
        });
      }

      const targetObjective = objectives[0];

      // Create a transaction to update both the log and the objective value
      await db.transaction(async (tx) => {
        // Create the log entry
        await tx.insert(table.objectiveLog).values({
          id: uuidv4(),
          value: form.data.value,
          notes: form.data.notes || null,
          loggedAt: new Date(),
          objectiveId: form.data.objectiveId,
          userId: userId,
        });

        // Update the objective's current value
        const newValue = targetObjective.value + form.data.value;
        await tx
          .update(table.objective)
          .set({ value: newValue })
          .where(eq(table.objective.id, form.data.objectiveId));

        // Update all widget metrics for this objective
        await updateObjectiveWidgetMetrics(tx, form.data.objectiveId);
      });

      return {
        form,
        success: true,
        message: `Added ${form.data.value} ${targetObjective.unit}`,
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

    const form = await superValidate(event, zod(undoLogSchema));
    const userId = event.locals.session.userId;

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      // First, get the objective to verify ownership
      const objectives = await db
        .select()
        .from(table.objective)
        .where(
          and(eq(table.objective.id, form.data.objectiveId), eq(table.objective.userId, userId))
        );

      if (objectives.length === 0) {
        return fail(404, {
          form,
          error: 'Objective not found',
        });
      }

      const targetObjective = objectives[0];

      // Get the most recent log entry for this objective
      const recentLogs = await db
        .select()
        .from(table.objectiveLog)
        .where(
          and(
            eq(table.objectiveLog.objectiveId, form.data.objectiveId),
            eq(table.objectiveLog.userId, userId)
          )
        )
        .orderBy(desc(table.objectiveLog.loggedAt))
        .limit(1);

      if (recentLogs.length === 0) {
        return fail(404, {
          form,
          error: 'No logs found to undo',
        });
      }

      const lastLog = recentLogs[0];

      // Create a transaction to delete the log and update the objective value
      await db.transaction(async (tx) => {
        // Delete the log entry
        await tx.delete(table.objectiveLog).where(eq(table.objectiveLog.id, lastLog.id));

        // Update the objective's current value
        const newValue = targetObjective.value - lastLog.value;
        await tx
          .update(table.objective)
          .set({ value: Math.max(0, newValue) }) // Ensure value doesn't go below 0
          .where(eq(table.objective.id, form.data.objectiveId));

        // Update all widget metrics for this objective
        await updateObjectiveWidgetMetrics(tx, form.data.objectiveId);
      });

      return {
        success: true,
        message: `Undid log of ${lastLog.value} ${targetObjective.unit}`,
      };
    } catch (error) {
      console.error('Error undoing objective log:', error);
      return fail(500, {
        form,
        error: 'Failed to undo log',
      });
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

    const userId = event.locals.session.userId;

    try {
      // First, get the objective to verify ownership
      const objectives = await db
        .select()
        .from(table.objective)
        .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)));

      if (objectives.length === 0) {
        return fail(404, { error: 'Objective not found' });
      }

      // Update the objective's archived status
      await db
        .update(table.objective)
        .set({ archived: !archived }) // Toggle the archived status
        .where(eq(table.objective.id, objectiveId));

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
