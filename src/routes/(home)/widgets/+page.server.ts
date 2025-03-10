import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { widget, objective } from '$lib/server/db/schema';
import { desc, eq, and, or, sql } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return {
      widgets: [],
    };
  }

  // Check if we're viewing completed widgets
  const isCompleted = event.url.searchParams.get('completed') !== null;

  // Base query conditions - user's widgets
  const conditions = eq(widget.userId, event.locals.session.userId);

  if (isCompleted) {
    // Add completed condition: fixed objectives where value >= endValue
    const widgetIds = await db
      .select({ id: widget.id })
      .from(widget)
      .innerJoin(objective, eq(widget.objectiveId, objective.id))
      .where(
        and(
          conditions,
          eq(objective.goalType, 'fixed'),
          sql`${objective.value} >= ${objective.endValue} AND ${objective.endValue} IS NOT NULL`
        )
      )
      .orderBy(desc(widget.createdAt));

    return {
      widgets: widgetIds.map((w) => w.id),
      isCompleted,
    };
  } else {
    // Active widgets: not completed (ongoing or fixed but not yet reached goal)
    const widgetIds = await db
      .select({ id: widget.id })
      .from(widget)
      .innerJoin(objective, eq(widget.objectiveId, objective.id))
      .where(
        and(
          conditions,
          or(
            eq(objective.goalType, 'ongoing'),
            sql`${objective.value} < ${objective.endValue} OR ${objective.endValue} IS NULL`
          )
        )
      )
      .orderBy(desc(widget.createdAt));

    return {
      widgets: widgetIds.map((w) => w.id),
      isCompleted,
    };
  }
};
