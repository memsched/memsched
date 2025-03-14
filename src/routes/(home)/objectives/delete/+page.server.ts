import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { deleteUserObjective } from '$lib/server/queries';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const objectiveId = (await event.request.formData()).get('objectiveId') as string;
    if (!objectiveId) {
      return error(400, 'Objective ID is required');
    }

    const result = await deleteUserObjective(event.locals.db, objectiveId, event.locals.session.userId);
    if (!result) {
      return error(404, 'Objective not found');
    }

    const refParts = event.request.headers.get('referer')?.split('/') ?? [];
    const ref = refParts[refParts.length - 1];

    if (ref === 'objectives') {
      return { success: true, message: 'Objective deleted successfully' };
    }
    return redirect(302, '/objectives');
  },
};
