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
