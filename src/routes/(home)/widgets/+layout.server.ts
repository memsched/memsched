import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      objectives: [],
    };
  }

  return {
    objectives: await db
      .select()
      .from(objective)
      .where(eq(objective.userId, event.locals.session.userId))
      .all(),
  };
};
