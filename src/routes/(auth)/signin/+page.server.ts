import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.session !== null && event.locals.user !== null) {
    return redirect(302, '/' + event.locals.user.username);
  }
  return {};
};
