import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { v4 as uuidv4 } from 'uuid';
import { formSchema } from '$lib/components/forms/widget-form/schema';
import type { LocalUser } from '$lib/types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/signin');
  }

  return {
    form: await superValidate(zod(formSchema)),
    // We tell typescript that the user is not null
    user: event.locals.user as LocalUser,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const objectives = await db
      .select()
      .from(table.objective)
      .where(
        and(
          eq(table.objective.id, form.data.objectiveId),
          eq(table.objective.userId, event.locals.session.userId)
        )
      );
    if (objectives.length === 0) {
      return error(404, 'Objective not found');
    }

    const userId = event.locals.session.userId;
    await db.transaction(async (tx) => {
      const widget = (
        await tx
          .insert(table.widget)
          .values({
            id: uuidv4(),
            title: form.data.title,
            subtitle: form.data.subtitle,
            // TODO: Sanitize imageUrl
            imageUrl: form.data.imageUrl,
            imagePlacement: form.data.imagePlacement,

            padding: form.data.padding,
            border: form.data.border,
            borderWidth: 1,
            borderRadius: form.data.borderRadius,
            color: form.data.color,
            accentColor: form.data.accentColor,
            backgroundColor: form.data.backgroundColor,
            // TODO: Update when user has pro plan
            watermark: true,

            objectiveId: form.data.objectiveId,
            userId,
          })
          .returning()
      )[0];

      for (const [i, metric] of form.data.metrics.entries()) {
        await tx.insert(table.widgetMetric).values({
          id: uuidv4(),
          value: 0,
          name: metric.name,
          timeRange: metric.timeRange,
          valueDecimalPrecision: metric.valueDecimalPrecision,

          order: i + 1,
          widgetId: widget.id,
          userId,
        });
      }
      // TODO: Call function to update the metric values
    });
    return redirect(302, '/widgets');
  },
};
