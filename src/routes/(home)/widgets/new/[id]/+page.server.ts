import type { LocalUser } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getUserWidget } from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const widget = await getUserWidget(event.locals.db, event.params.id, event.locals.session.userId);
  if (!widget) {
    return error(404, 'Widget not found');
  }

  return {
    widget,
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};
