import type { PageServerLoad, Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { deleteUser } from '$lib/server/queries';
import { deleteSessionTokenCookie } from '$lib/server/session';
import type { LocalUser } from '$lib/types';

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

    try {
      await deleteUser(event.locals.db, userId);
      deleteSessionTokenCookie(event);
    } catch (err) {
      console.error('Error deleting account:', err);
      return error(500, 'Failed to delete account');
    }

    return redirect(302, '/auth/signin');
  },
};
