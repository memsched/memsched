import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { objective } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const actions: Actions = {
  default: async (event) => {
    if (event.locals.session === null) {
      return error(401, 'Unauthorized');
    }

    const formData = await event.request.formData();
    const objectiveId = parseInt(formData.get('objectiveId') as string);
    if (isNaN(objectiveId)) {
      return error(400, 'Invalid objective id');
    }

    await db.delete(objective).where(eq(objective.id, objectiveId));

    return { success: true, message: 'Objective deleted successfully' };
  },
};
