import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { widget } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      widgets: [],
    };
  }
  const widgets = await db
    .select({
      id: widget.id,
    })
    .from(widget)
    .where(eq(widget.userId, event.locals.session.userId))
    .orderBy(desc(widget.createdAt));

  return { widgets: widgets.flatMap(({ id }) => id) };
};
