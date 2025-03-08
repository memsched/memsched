import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserOverviewUrl } from '$lib/api';

export const load: PageServerLoad = async (event) => {
  if (event.locals.session !== null && event.locals.user !== null) {
    return redirect(302, getUserOverviewUrl(event.locals.user.username));
  }
  return {};
};
