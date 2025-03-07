import { and, eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { widget } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }
    const userId = event.locals.session.userId;
    const widgetId = (await event.request.formData()).get('widgetId') as string;

    const widgets = await db
      .select()
      .from(widget)
      .where(and(eq(widget.id, widgetId), eq(widget.userId, userId)));

    if (widgets.length === 0) {
      return error(404, 'Widget not found');
    }

    await db.delete(widget).where(and(eq(widget.id, widgetId), eq(widget.userId, userId)));

    return redirect(302, '/widgets');
  },
};
