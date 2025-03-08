import { db } from '$lib/server/db';
import { widget } from '$lib/server/db/schema';
import type { LocalUser } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const widgets = await db
    .select()
    .from(widget)
    .where(and(eq(widget.id, event.params.id), eq(widget.userId, event.locals.session.userId)));

  if (widgets.length === 0) {
    return error(404, 'Widget not found');
  }

  return {
    widget: widgets[0],
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};
