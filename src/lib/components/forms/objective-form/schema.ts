import { z } from 'zod';

export const OBJECTIVE_UNITS = ['minutes', 'hours', 'pages', 'words', 'lines'] as const;

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'The name must be at least 1 character long.' })
      .max(50, { message: 'The name is too long, it must be under 50 characters.' }),
    description: z
      .string()
      .max(250, { message: 'Your description is too long, it should be under 250 characters.' }),
    startValue: z
      .number()
      .min(0, { message: "Start value can't be less than 0, please try again." }),
    unit: z.enum(OBJECTIVE_UNITS, {
      message: 'Please select a valid unit.',
    }),
    visibility: z.enum(['public', 'private'], {
      message: 'Visibility should be either "public" or "private".',
    }),
    goalType: z.enum(['fixed', 'ongoing'], { message: 'Please select a goal type.' }),
    endValue: z
      .number()
      .min(0, { message: "End value can't be less than 0, please enter a valid value." })
      .nullable(),
  })
  .refine((data) => data.goalType !== 'fixed' || data.endValue !== null, {
    message:
      'Looks like you forgot to add an end value. It\'s required when the goal type is "fixed."',
    path: ['endValue'],
  })
  .refine(
    (data) =>
      data.goalType !== 'fixed' || (data.endValue !== null && data.endValue > data.startValue),
    {
      message:
        'End value needs to be greater than start value when the goal type is "fixed". Please double-check.',
      path: ['endValue'],
    }
  );

export type FormSchema = typeof formSchema;
