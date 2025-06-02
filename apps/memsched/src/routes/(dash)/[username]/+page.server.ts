/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { okAsync, ResultAsync } from 'neverthrow';

import type { Widget } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { handleDbError } from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const userResult = await event.locals.usersService.getByUsername(event.params.username);
  if (userResult.isErr()) {
    return handleDbError(userResult);
  }
  const user = userResult.value;
  const isOwner = user.id === event.locals.session?.userId;

  let widget: Widget | null = null;
  const widgetDark = event.url.searchParams.has('dark');
  const widgetIdSearchParam = event.url.searchParams.get('w');
  if (widgetIdSearchParam) {
    const widgetResult = await event.locals.widgetsService.getPublic(widgetIdSearchParam);
    if (widgetResult.isErr()) {
      return handleDbError(widgetResult);
    }
    widget = widgetResult.value;
  }

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
    widget,
    widgetDark,
  };
};
