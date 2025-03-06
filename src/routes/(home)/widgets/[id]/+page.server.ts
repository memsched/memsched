import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eq, and } from 'drizzle-orm';
import { formSchema, type FormSchema } from '$lib/components/forms/widget-form/schema';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';
import type { z } from 'zod';
import { getWidget } from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/signin');
  }

  const widgetId = event.params.id;
  const widget = await getWidget(widgetId);
  if (!widget) {
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
      .from(objective)
      .where(
        and(eq(objective.id, event.params.id), eq(objective.userId, event.locals.session.userId))
      );

    if (objectives.length === 0) {
      return error(404, 'Objective not found');
    }

    const objectiveId = event.params.id;
    await db
      .update(objective)
      .set({
        name: form.data.name,
        description: form.data.description,
        unit: form.data.unit,
        visibility: form.data.visibility,
        endValue: form.data.endValue,
      })
      .where(and(eq(objective.id, objectiveId), eq(objective.userId, event.locals.session.userId)));

    return message(form, 'Objective sucessfully updated!');
  },
};
