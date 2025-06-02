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
