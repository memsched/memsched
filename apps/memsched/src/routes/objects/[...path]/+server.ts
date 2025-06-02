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
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  const result = await locals.store.get(url.pathname);
  if (result.isErr()) {
    throw error(500, 'Failed to retrieve object');
  }

  const data = result.value;
  if (!data) {
    throw error(404, 'Object not found');
  }

  // Return the file with appropriate headers
  return new Response(data.buffer, {
    headers: {
      'Content-Type': data.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
      'Content-Length': data.buffer.byteLength.toString(),
    },
  });
};

// HEAD method for efficient caching
export const HEAD: RequestHandler = async ({ url, locals }) => {
  const result = await locals.store.get(url.pathname);
  if (result.isErr()) {
    throw error(500, 'Failed to retrieve object');
  }

  const data = result.value;
  if (!data) {
    throw error(404, 'Object not found');
  }

  // Return just the headers without the body
  return new Response(null, {
    headers: {
      'Content-Type': data.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
      'Content-Length': data.buffer.byteLength.toString(),
    },
  });
};
