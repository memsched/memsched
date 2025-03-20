import type { LocalUser } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { formSchema } from '$lib/components/forms/profile-form/schema';
import { isUsernameValid, updateUser } from '$lib/server/queries';

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
      const usernameValid = await isUsernameValid(
        event.locals.db,
        form.data.username,
        currentUser.id
      );
      if (!usernameValid) {
        setError(form, 'username', 'This username is already taken.');
        return fail(400, { form });
      }
    }

    try {
      await updateUser(event.locals.db, currentUser.id, form.data);

      return message(form, 'Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      return fail(500, {
        form,
        error: 'Failed to update profile. Please try again.',
      });
    }
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
      const usernameValid = await isUsernameValid(
        event.locals.db,
        form.data.username,
        currentUser.id
      );
      if (!usernameValid) {
        setError(form, 'username', 'This username is already taken.');
        return fail(400, { form });
      }
    }

    return { form };
  },
};
