import { z } from 'zod';

export const logSchema = z.object({
  objectiveId: z.string().min(1, 'Objective ID is required'),
  value: z
    .number({ message: 'Value must be greater than 0' })
    .min(0.01, 'Value must be greater than 0'),
  notes: z
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
});

export type LogSchema = typeof logSchema;
export type LogFormSchema = z.infer<typeof logSchema>;
