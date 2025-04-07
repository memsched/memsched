import { and, desc, eq, or, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import type { FormSchema } from '$lib/components/forms/objective-form/schema';

import type { DBType } from '../db';
import * as table from '../db/schema';
import { DrizzleRecordNotFoundErrorCause, wrapResultAsync, wrapResultAsyncFn } from '../db/types';

export class ObjectivesService {
  constructor(private readonly db: DBType) {}

  public getAll(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objective)
        .where(eq(table.objective.userId, userId))
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getAllActive(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objective)
        .where(
          and(
            eq(table.objective.userId, userId),
            eq(table.objective.archived, false),
            or(
              eq(table.objective.goalType, 'ongoing'),
              sql`${table.objective.value} < ${table.objective.endValue} OR ${table.objective.endValue} IS NULL`
            )
          )
        )
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getAllCompleted(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objective)
        .where(
          and(
            eq(table.objective.userId, userId),
            eq(table.objective.archived, false),
            eq(table.objective.goalType, 'fixed'),
            sql`${table.objective.value} >= ${table.objective.endValue} AND ${table.objective.endValue} IS NOT NULL`
          )
        )
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public getAllArchived(userId: string) {
    return wrapResultAsync(
      this.db
        .select()
        .from(table.objective)
        .where(and(eq(table.objective.userId, userId), eq(table.objective.archived, true)))
        .orderBy(desc(table.objective.createdAt))
    );
  }

  public get(objectiveId: string, userId: string) {
    return wrapResultAsyncFn(async () => {
      const objectives = await this.db
        .select()
        .from(table.objective)
        .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)))
        .limit(1);

      if (objectives.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('Objective not found');
      }
      return objectives[0];
    });
  }

  public updateObjectiveValue(objectiveId: string, value: number) {
    return wrapResultAsyncFn(async () => {
      return (
        await this.db
          .update(table.objective)
          .set({ value })
          .where(eq(table.objective.id, objectiveId))
          .returning()
      )[0];
    });
  }

  public toggleArchived(objectiveId: string, userId: string) {
    return this.get(objectiveId, userId).andThen((objective) =>
      wrapResultAsync(
        this.db
          .update(table.objective)
          .set({ archived: !objective.archived })
          .where(eq(table.objective.id, objectiveId))
      )
    );
  }

  public create(objectiveData: z.infer<FormSchema>, userId: string) {
    return wrapResultAsyncFn(async () => {
      const objectiveId = uuidv4();
      const batchRes = await this.db.batch([
        this.db
          .insert(table.objective)
          .values({
            id: objectiveId,
            name: objectiveData.name,
            description: objectiveData.description,
            startValue: objectiveData.startValue,
            value: objectiveData.startValue,
            unit: objectiveData.unit,
            goalType: objectiveData.goalType,
            endValue: objectiveData.endValue,
            userId,
          })
          .returning(),
        this.db.insert(table.objectiveLog).values({
          id: uuidv4(),
          value: objectiveData.startValue,
          notes: '',
          loggedAt: new Date(),
          objectiveId,
          userId,
        }),
      ]);

      return batchRes[0][0];
    });
  }

  public update(objectiveId: string, objectiveData: z.infer<FormSchema>, userId: string) {
    return this.get(objectiveId, userId).andThen(() =>
      wrapResultAsync(
        this.db
          .update(table.objective)
          .set({
            name: objectiveData.name,
            description: objectiveData.description,
            unit: objectiveData.unit,
            goalType: objectiveData.goalType,
            endValue: objectiveData.endValue,
          })
          .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)))
      )
    );
  }

  public delete(objectiveId: string, userId: string) {
    return this.get(objectiveId, userId).andThen(() =>
      wrapResultAsync(
        this.db
          .delete(table.objective)
          .where(and(eq(table.objective.id, objectiveId), eq(table.objective.userId, userId)))
      )
    );
  }
}
