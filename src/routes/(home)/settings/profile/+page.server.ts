import type { LocalUser } from '$lib/types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  return {
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};
