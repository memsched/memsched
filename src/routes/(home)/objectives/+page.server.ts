import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return {
      objetives: [],
    };
  }
  return {
    objetives: await db
      .select()
      .from(objective)
      .where(eq(objective.userId, event.locals.user.id))
      .orderBy(desc(objective.createdAt)),
  };
};
