import { handleDbError } from '$lib/server/utils';
import { ResultAsync, okAsync } from 'neverthrow';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const userResult = await event.locals.usersService.getUserByUsername(event.params.username);
  if (userResult.isErr()) {
    return handleDbError(userResult);
  }
  const user = userResult.value;

  const result = await event.locals.widgetsService
    .getUserPublicWidgetIds(user.id)
    .andThen((publicWidgetIds) =>
      ResultAsync.combine([
        okAsync(publicWidgetIds),
        event.locals.objectivesService.getUserPublicObjectives(user.id),
      ])
    );

  if (result.isErr()) {
    return handleDbError(result);
  }

  const [publicWidgetIds, publicObjectives] = result.value;

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
