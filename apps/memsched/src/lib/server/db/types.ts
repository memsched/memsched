/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import {
  DrizzleError as DrizzleErrorCause,
  TransactionRollbackError as TransactionRollbackErrorCause,
} from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import * as table from './schema';

// unknown catch-all error
export type UnknownError = {
  error: 'unknown_error';
  message: string;
  cause: unknown;
};

// this is a custom error we'll throw when we find no
// records and we only want to return one record
export class DrizzleRecordNotFoundErrorCause extends Error {}

export type DrizzleRecordNotFoundError = {
  error: 'drizzle_record_not_found_error';
  message: string;
  cause: DrizzleRecordNotFoundErrorCause;
};

// these errors wrap drizzle core errors with the `error` key
// so that they can be narrowed down as a discriminated union
export type DrizzleGenericError = {
  error: 'drizzle_generic_error';
  message: string;
  cause: DrizzleErrorCause;
};

export type DrizzleTransactionRollbackError = {
  error: 'drizzle_transaction_rollback_error';
  message: string;
  cause: TransactionRollbackErrorCause;
};

export type DrizzleError =
  | DrizzleGenericError
  | DrizzleTransactionRollbackError
  | DrizzleRecordNotFoundError
  | UnknownError;

export function createDrizzleError(cause: unknown) {
  if (cause instanceof TransactionRollbackErrorCause) {
    return {
      error: 'drizzle_transaction_rollback_error',
      message: cause.message,
      cause: cause,
    } satisfies DrizzleTransactionRollbackError;
  }

  if (cause instanceof DrizzleErrorCause) {
    return {
      error: 'drizzle_generic_error',
      message: cause.message,
      cause: cause,
    } satisfies DrizzleGenericError;
  }

  if (cause instanceof DrizzleRecordNotFoundErrorCause) {
    return {
      error: 'drizzle_record_not_found_error',
      message: cause.message,
      cause: cause,
    } satisfies DrizzleRecordNotFoundError;
  }

  return {
    error: 'unknown_error',
    message: 'Unknown error',
    cause: cause,
  } satisfies UnknownError;
}

export function wrapResultAsync<T>(promise: Promise<T>): ResultAsync<T, DrizzleError> {
  return ResultAsync.fromPromise(promise, (e) => createDrizzleError(e));
}

export function wrapResultAsyncFn<T>(promise: () => Promise<T>): ResultAsync<T, DrizzleError> {
  return ResultAsync.fromPromise(promise(), (e) => createDrizzleError(e));
}

export type User = typeof table.user.$inferSelect;
export type UserInsert = typeof table.user.$inferInsert;
export type AuthProvider = typeof table.authProvider.$inferSelect;
export type Session = typeof table.session.$inferSelect;
export type Objective = typeof table.objective.$inferSelect;
export type Widget = typeof table.widget.$inferSelect;

export type WidgetMetric = typeof table.widgetMetric.$inferSelect;
export type WidgetJoinMetrics = Widget & {
  metrics: WidgetMetric[];
};
export type GithubStatsCache = typeof table.githubStatsCache.$inferSelect;
export type GithubStatsCacheInsert = typeof table.githubStatsCache.$inferInsert;
