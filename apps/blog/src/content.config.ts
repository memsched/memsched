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
import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      metaImage: z.string().optional(),
      twitterCreator: z.string().optional(),
    })
    .and(
      z.union([
        // Option 1: No hero image and no related fields
        z.object({
          heroImage: z.undefined(),
          heroImageAlt: z.undefined(),
          heroImageWidth: z.undefined(),
          heroImageHeight: z.undefined(),
        }),
        // Option 2: All hero image fields required
        z.object({
          heroImage: z.string(),
          heroImageAlt: z.string(),
          heroImageWidth: z.number(),
          heroImageHeight: z.number(),
        }),
      ])
    ),
});

export const collections = { blog };
