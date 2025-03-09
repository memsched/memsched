import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateObjectiveWidgetMetrics } from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      objectives: [],
    };
  }
  return {
    objectives: await db
      .select()
      .from(table.objective)
      .where(eq(table.objective.userId, event.locals.session.userId))
      .orderBy(desc(table.objective.createdAt)),
  };
};

// Schema for objective logging
const logSchema = z.object({
  objectiveId: z.string().min(1, 'Objective ID is required'),
  value: z.number().min(0.01, 'Value must be greater than 0'),
  notes: z.string().optional(),
});

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
};
