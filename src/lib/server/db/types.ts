import {
  TransactionRollbackError as TransactionRollbackErrorCause,
  DrizzleError as DrizzleErrorCause,
} from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

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
