import type { PageServerLoad, Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { deleteSessionTokenCookie } from '$lib/server/session';
import type { LocalUser } from '$lib/types';
import { handleDbError } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  return {
    user: event.locals.user as LocalUser,
  };
};

export const actions: Actions = {
  deleteAccount: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const formData = await event.request.formData();
    const userId = formData.get('userId') as string;

    // Verify the user is deleting their own account
    if (userId !== event.locals.session.userId) {
      return error(403, 'Forbidden');
    }

    const result = await event.locals.usersService.deleteUser(userId);
    if (result.isErr()) {
      return handleDbError(result);
    }

    deleteSessionTokenCookie(event);
    return redirect(302, '/auth/signin');
  },
};
