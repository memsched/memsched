import type { LocalUser } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { user } from '$lib/server/db/schema';
import { eq, and, not } from 'drizzle-orm';
import { formSchema } from '$lib/components/forms/profile-form/schema';
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { DBType } from '$lib/server/db';

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

// Helper function to check if username is already taken by another user
async function isUsernameTaken(db: DBType, username: string, currentUserId: string) {
  const existingUsers = await db
    .select()
    .from(user)
    .where(and(eq(user.username, username), not(eq(user.id, currentUserId))))
    .limit(1);

  return existingUsers.length > 0;
}

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
      const usernameTaken = await isUsernameTaken(
        event.locals.db,
        form.data.username,
        currentUser.id
      );
      if (usernameTaken) {
        setError(form, 'username', 'This username is already taken.');
        return fail(400, { form });
      }
    }

    try {
      await event.locals.db
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
      const usernameTaken = await isUsernameTaken(
        event.locals.db,
        form.data.username,
        currentUser.id
      );
      if (usernameTaken) {
        setError(form, 'username', 'This username is already taken.');
        return fail(400, { form });
      }
    }

    return { form };
  },
};
