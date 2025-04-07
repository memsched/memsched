import type { LocalUser } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { formSchema } from '$lib/components/forms/profile-form/schema';
import { handleFormDbError } from '$lib/server/utils';

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
