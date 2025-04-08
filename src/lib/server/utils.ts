import { error, fail } from '@sveltejs/kit';
import crypto from 'crypto';
import type { Err } from 'neverthrow';
import type { SuperValidated } from 'sveltekit-superforms/client';

import { type DrizzleError, DrizzleRecordNotFoundErrorCause } from './db/types';

export function sanitizeUsername(username: string): string {
  return username
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove non-alphanumeric and non -/_ characters
    .replace(/_{2,}/g, '_') // Replace multiple underscores with a single one
    .replace(/-{2,}/g, '-') // Replace multiple dashes with a single one
    .replace(/^[-_]+|[-_]+$/g, ''); // Trim dashes and underscores from start and end
}

export function stringToEtag(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function handleDbError(result: Err<any, DrizzleError>) {
  if (result.error.cause instanceof DrizzleRecordNotFoundErrorCause) {
    return error(404, result.error.message);
  }
  console.error(result.error);
  return error(500, 'Something went wrong');
}

export function handleFormDbError(result: Err<any, DrizzleError>, form?: SuperValidated<any, any>) {
  if (result.error.cause instanceof DrizzleRecordNotFoundErrorCause) {
    return fail(404, { form, error: result.error.message });
  }
  console.error(result.error);
  return fail(500, { form, error: 'Something went wrong' });
}
