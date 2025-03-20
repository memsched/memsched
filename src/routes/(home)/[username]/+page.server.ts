import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import {
  getUserByUsername,
  getUserPublicWidgetIds,
  getUserPublicObjectives,
} from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
  const user = await getUserByUsername(event.locals.db, event.params.username);
  if (!user) {
    return error(404, 'User not found');
  }

  const publicWidgetIds = await getUserPublicWidgetIds(event.locals.db, user.id);
  const publicObjectives = await getUserPublicObjectives(event.locals.db, user.id);

  return {
    publicUser: {
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      website: user.website,
      widgets: publicWidgetIds,
    },
    isOwner: user.id === event.locals.session?.userId,
    publicObjectives,
  };
};
