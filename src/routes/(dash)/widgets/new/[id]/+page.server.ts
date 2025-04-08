import { redirect } from '@sveltejs/kit';

import { handleDbError } from '$lib/server/utils';
import type { LocalUser } from '$lib/types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const widget = await event.locals.widgetsService.get(
    event.params.id,
    event.locals.session.userId
  );
  if (widget.isErr()) {
    return handleDbError(widget);
  }

  return {
    widget: widget.value,
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};
