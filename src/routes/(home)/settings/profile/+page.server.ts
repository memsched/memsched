import type { LocalUser } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { formSchema } from '$lib/components/forms/profile-form/schema';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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
  default: async (event) => {
    if (!event.locals.session) {
      return redirect(302, '/auth/signin');
    }

    const currentUser = event.locals.user as LocalUser;
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await db
        .update(user)
        .set({
          username: form.data.username,
          name: form.data.name,
          bio: form.data.bio || null,
          location: form.data.location || null,
          website: form.data.website || null,
        })
        .where(eq(user.id, currentUser.id));

      return message(form, 'Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      return fail(500, {
        form,
        error: 'Failed to update profile. Please try again.',
      });
    }
  },
};
