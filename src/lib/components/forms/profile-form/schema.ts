import { z } from 'zod';

export const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(30, { message: 'Username is too long, it must be under 30 characters.' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Username can only contain letters, numbers, underscores, and hyphens.',
    }),
  name: z
    .string()
    .min(1, { message: 'Name must be at least 1 character long.' })
    .max(50, { message: 'Name is too long, it must be under 50 characters.' }),
  bio: z
    .string()
    .max(250, { message: 'Your bio is too long, it should be under 250 characters.' })
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, { message: 'Location is too long, it should be under 100 characters.' })
    .optional()
    .nullable(),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL starting with http:// or https://' })
    .max(100, { message: 'Website URL is too long, it should be under 100 characters.' })
    .optional()
    .nullable(),
  avatarUrl: z.string().nullable().optional(),
});

export type FormSchema = typeof formSchema;
