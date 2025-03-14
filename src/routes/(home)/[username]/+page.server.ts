import type { PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const users = await event.locals.db
    .select()
    .from(table.user)
    .where(eq(table.user.username, event.params.username));

  if (users.length === 0) {
    return error(404, 'User not found');
  }
  const user = users[0];

  const widgets = await event.locals.db
    .select({
      id: table.widget.id,
    })
    .from(table.widget)
    .innerJoin(table.objective, eq(table.objective.id, table.widget.objectiveId))
    .where(and(eq(table.widget.userId, user.id), eq(table.objective.visibility, 'public')))
    .orderBy(desc(table.widget.createdAt));

  // Fetch public objectives for this user
  const publicObjectives = await event.locals.db
    .select()
    .from(table.objective)
    .where(and(eq(table.objective.userId, user.id), eq(table.objective.visibility, 'public')))
    .orderBy(desc(table.objective.createdAt));

  return {
    publicUser: {
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      website: user.website,
      widgets: widgets.flatMap(({ id }) => id),
    },
    isOwner: user.id === event.locals.session?.userId,
    publicObjectives,
  };
};
