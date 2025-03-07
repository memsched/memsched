import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eq, and } from 'drizzle-orm';
import { formSchema, type FormSchema } from '$lib/components/forms/widget-form/schema';
import { db } from '$lib/server/db';
import type { z } from 'zod';
import { getWidget } from '$lib/server/queries';
import type { LocalUser } from '$lib/types';
import * as table from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/signin');
  }

  const widgetId = event.params.id;
  const widget = await getWidget(widgetId);
  if (!widget || widget.userId !== event.locals.session.userId) {
    return error(404, 'Widget not found');
  }

  const form = await superValidate(zod(formSchema));
  form.data = {
    title: widget.title,
    subtitle: widget.subtitle,
    // TODO: Sanitize imageUrl
    imageUrl: widget.imageUrl,
    imagePlacement: widget.imagePlacement as z.infer<FormSchema>['imagePlacement'],

    padding: widget.padding,
    border: widget.border,
    borderWidth: widget.borderWidth,
    borderRadius: widget.borderRadius,
    color: widget.color,
    accentColor: widget.accentColor,
    backgroundColor: widget.backgroundColor,
    watermark: widget.watermark,

    objectiveId: widget.objectiveId,
    metrics: widget.metrics.map((metric) => ({
      name: metric.name,
      timeRange: metric.timeRange as z.infer<FormSchema>['metrics'][0]['timeRange'],
      valueDecimalPrecision: metric.valueDecimalPrecision,
    })),
  };

  return {
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

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const widgetId = event.params.id;
    const userId = event.locals.session.userId;

    // First check if the widget exists and belongs to the user
    const widgets = await db
      .select()
      .from(table.widget)
      .where(and(eq(table.widget.id, widgetId), eq(table.widget.userId, userId)));

    if (widgets.length === 0) {
      return error(404, 'Widget not found');
    }

    // Check if the objective exists and belongs to the user
    const objectives = await db
      .select()
      .from(table.objective)
      .where(
        and(eq(table.objective.id, form.data.objectiveId), eq(table.objective.userId, userId))
      );

    if (objectives.length === 0) {
      return error(404, 'Objective not found');
    }

    await db.transaction(async (tx) => {
      // Update the widget
      await tx
        .update(table.widget)
        .set({
          title: form.data.title,
          subtitle: form.data.subtitle,
          imageUrl: form.data.imageUrl,
          imagePlacement: form.data.imagePlacement,

          padding: form.data.padding,
          border: form.data.border,
          borderWidth: 1,
          borderRadius: form.data.borderRadius,
          color: form.data.color,
          accentColor: form.data.accentColor,
          backgroundColor: form.data.backgroundColor,

          objectiveId: form.data.objectiveId,
          // Don't update userId as it should remain the same
          // Don't update watermark status as it's dependent on user plan
        })
        .where(eq(table.widget.id, widgetId));

      // Delete all existing metrics (simple approach)
      await tx.delete(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId));

      // Insert new metrics
      for (const [i, metric] of form.data.metrics.entries()) {
        await tx.insert(table.widgetMetric).values({
          id: uuidv4(),
          value: 0,
          name: metric.name,
          timeRange: metric.timeRange,
          valueDecimalPrecision: metric.valueDecimalPrecision,
          order: i + 1,
          widgetId: widgetId,
          userId,
        });
      }
      // TODO: Call function to update the metric values
    });

    return message(form, 'Widget successfully updated!');
  },
};
