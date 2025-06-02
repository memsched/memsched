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
import { error, fail, redirect } from '@sveltejs/kit';
import { okAsync } from 'neverthrow';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { formSchema } from '$lib/components/forms/widget-form/schema';
import { imageUploadLimiter } from '$lib/server/rate-limiter';
import { handleDbError, handleFormDbError } from '$lib/server/utils';
import { processWidgetImage } from '$lib/server/utils/image';
import type { LocalUser } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }
  const objectivesResult = await event.locals.objectivesService.getAll(event.locals.session.userId);
  if (objectivesResult.isErr()) {
    return handleDbError(objectivesResult);
  }
  const objectives = objectivesResult.value;

  const form = await superValidate(zod(formSchema));

  return {
    objectives,
    form,
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    if (await imageUploadLimiter.isLimited(event)) {
      return fail(429, { error: 'Too many requests. Please try again later.' });
    }

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const widgetCount = await event.locals.widgetsService.getUserWidgetCount(
      event.locals.session.userId
    );
    if (widgetCount.isErr()) {
      return handleFormDbError(widgetCount, form);
    }

    const planLimits = await event.locals.paymentService.getPlanLimits(event.locals.user);
    if (planLimits.isErr()) {
      return handleFormDbError(planLimits, form);
    }

    if (widgetCount.value >= planLimits.value.maxWidgets) {
      return fail(400, {
        form,
        widgetLimitReached: true,
        message: `You've reached the maximum limit of ${planLimits.value.maxWidgets} widgets.`,
      });
    }

    // Validate and process the image if present
    if (form.data.imageUrl) {
      if (form.data.imageUrl.startsWith('data:image/')) {
        // Check base64 image with moderation service
        const isSafe = await event.locals.moderationService.isImageSafe(form.data.imageUrl);
        if (isSafe.isErr()) {
          return handleFormDbError(isSafe, form);
        }
        if (!isSafe.value) {
          return fail(400, {
            form,
            message: 'The provided image was flagged as inappropriate.',
          });
        }
      } else if (!form.data.imageUrl.startsWith(event.url.origin)) {
        return fail(400, {
          form,
          message: 'External image URLs are not allowed.',
        });
      }

      // Process the image
      form.data.imageUrl = await processWidgetImage(form.data.imageUrl);
    }

    const res = await event.locals.widgetsService
      .create(form.data, event.locals.session.userId)
      .andThen((widgetId) => okAsync(widgetId));

    if (res.isErr()) {
      return handleFormDbError(res, form);
    }

    const widgetId = res.value;
    if (form.data.visibility !== 'public') {
      return redirect(302, `/widgets`);
    }

    return redirect(302, `/widgets/new/${widgetId}`);
  },
};
