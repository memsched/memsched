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
