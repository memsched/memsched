import type { PageServerLoad, Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
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
      await event.locals.db.delete(user).where(eq(user.id, userId));
      event.cookies.delete('session_id', { path: '/' });
    } catch (err) {
      console.error('Error deleting account:', err);
      return error(500, 'Failed to delete account');
    }

    return redirect(302, '/auth/signin');
  },
};
