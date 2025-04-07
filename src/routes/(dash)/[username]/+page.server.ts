import { handleDbError } from '$lib/server/utils';
import { ResultAsync, okAsync } from 'neverthrow';
import type { PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
  const userResult = await event.locals.usersService.getByUsername(event.params.username);
  if (userResult.isErr()) {
    return handleDbError(userResult);
  }
  const user = userResult.value;
  const isOwner = user.id === event.locals.session?.userId;

  let objectives: table.Objective[] = [];
  let widgetIds: string[] = [];
  if (isOwner) {
    const res = await event.locals.objectivesService
      .getAll(user.id)
      .andThen((objectives) =>
        ResultAsync.combine([okAsync(objectives), event.locals.widgetsService.getAll(user.id)])
      );
    if (res.isErr()) {
      return handleDbError(res);
    }
    objectives = res.value[0];
    widgetIds = res.value[1].map((widget) => widget.id);
  } else {
    const publicWidgetsResult = await event.locals.widgetsService.getAllPublic(user.id);
    if (publicWidgetsResult.isErr()) {
      return handleDbError(publicWidgetsResult);
    }
    widgetIds = publicWidgetsResult.value.map((widget) => widget.id);
  }

  return {
    publicUser: {
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      website: user.website,
      widgets: widgetIds,
    },
    objectives,
    isOwner: user.id === event.locals.session?.userId,
  };
};
