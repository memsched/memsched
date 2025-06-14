import { redirect } from '@sveltejs/kit';

import { getUserOverviewUrl } from '$lib/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.session !== null && event.locals.user !== null) {
    return redirect(302, getUserOverviewUrl(event.locals.user.username));
  }
  return {};
};
