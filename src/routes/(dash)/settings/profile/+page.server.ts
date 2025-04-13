import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { formSchema } from '$lib/components/forms/profile-form/schema';
import { handleFormDbError } from '$lib/server/utils';
import type { LocalUser } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  const currentUser = event.locals.user as LocalUser;

  const form = await superValidate(
    {
      username: currentUser.username,
      name: currentUser.name,
      bio: currentUser.bio,
      location: currentUser.location,
      website: currentUser.website,
      avatarUrl: currentUser.avatarUrl,
    },
    zod(formSchema)
  );

  return {
    user: currentUser,
    form,
  };
};

export const actions: Actions = {
  post: async (event) => {
    if (!event.locals.session) {
      return redirect(302, '/auth/signin');
    }

    const currentUser = event.locals.user as LocalUser;
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Check if username is already taken by another user
    if (form.data.username !== currentUser.username) {
      const isUsernameSafe = await event.locals.moderationService.isTextSafe(form.data.username);
      if (isUsernameSafe.isErr()) {
        return handleFormDbError(isUsernameSafe, form);
      }
      if (!isUsernameSafe.value) {
        setError(form, 'username', 'This username is not allowed.');
        return fail(400, { form });
      }
      const usernameValid = await event.locals.usersService.isUsernameValid(
        form.data.username,
        currentUser.id
      );
      if (usernameValid.isErr()) {
        return handleFormDbError(usernameValid, form);
      }
      if (!usernameValid.value) {
        setError(form, 'username', 'This username is already taken.');
        return fail(400, { form });
      }
    }

    if (form.data.bio && form.data.bio !== currentUser.bio) {
      const isBioSafe = await event.locals.moderationService.isTextSafe(form.data.bio);
      if (isBioSafe.isErr()) {
        return handleFormDbError(isBioSafe, form);
      }
      if (!isBioSafe.value) {
        setError(form, 'bio', 'This bio is not allowed.');
        return fail(400, { form });
      }
    }

    if (form.data.location && form.data.location !== currentUser.location) {
      const isLocationSafe = await event.locals.moderationService.isTextSafe(form.data.location);
      if (isLocationSafe.isErr()) {
        return handleFormDbError(isLocationSafe, form);
      }
      if (!isLocationSafe.value) {
        setError(form, 'location', 'This location is not allowed.');
        return fail(400, { form });
      }
    }

    if (form.data.website && form.data.website !== currentUser.website) {
      const isWebsiteSafe = await event.locals.moderationService.isTextSafe(form.data.website);
      if (isWebsiteSafe.isErr()) {
        return handleFormDbError(isWebsiteSafe, form);
      }
      if (!isWebsiteSafe.value) {
        setError(form, 'website', 'This website is not allowed.');
        return fail(400, { form });
      }
    }

    const res = await event.locals.usersService.update(currentUser.id, form.data);
    if (res.isErr()) {
      return handleFormDbError(res, form);
    }

    return message(form, 'Profile updated successfully.');
  },

  // Add a check action for debounced username validation
  check: async (event) => {
    if (!event.locals.session) {
      return redirect(302, '/auth/signin');
    }

    const currentUser = event.locals.user as LocalUser;
    const form = await superValidate(event, zod(z.object({ username: z.string() })));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Check if username is already taken by another user
    if (form.data.username !== currentUser.username) {
      const usernameValid = await event.locals.usersService.isUsernameValid(
        form.data.username,
        currentUser.id
      );
      if (usernameValid.isErr()) {
        return handleFormDbError(usernameValid, form);
      }
      if (!usernameValid.value) {
        setError(form, 'username', 'This username is already taken.');
        return fail(400, { form });
      }
    }

    return { form };
  },
};
