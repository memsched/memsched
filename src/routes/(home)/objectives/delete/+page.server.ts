import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { objective } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const actions: Actions = {
  default: async (event) => {
    if (event.locals.session === null) {
      return error(401, 'Unauthorized');
    }

    const objectiveId = (await event.request.formData()).get('objectiveId') as string;
    const ob = await db.select().from(objective).where(eq(objective.id, objectiveId));
    if (!ob.length) {
      return error(400, 'Invalid objective id');
    }

    await db.delete(objective).where(eq(objective.id, objectiveId));

    const refParts = event.request.headers.get('referer')?.split('/') ?? [];
    const ref = refParts[refParts.length - 1];

    if (ref === 'objectives') {
      return { success: true, message: 'Objective deleted successfully' };
    }
    return redirect(302, '/objectives');
  },
};
