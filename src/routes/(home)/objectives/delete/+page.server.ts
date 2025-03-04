import { and, eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { objective } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const objectiveId = (await event.request.formData()).get('objectiveId') as string;
    const objectives = await db
      .select()
      .from(objective)
      .where(and(eq(objective.id, objectiveId), eq(objective.userId, event.locals.session.userId)));

    if (objectives.length === 0) {
      return error(404, 'Objective not found');
    }

    await db
      .delete(objective)
      .where(and(eq(objective.id, objectiveId), eq(objective.userId, event.locals.session.userId)));

    const refParts = event.request.headers.get('referer')?.split('/') ?? [];
    const ref = refParts[refParts.length - 1];

    if (ref === 'objectives') {
      return { success: true, message: 'Objective deleted successfully' };
    }
    return redirect(302, '/objectives');
  },
};
