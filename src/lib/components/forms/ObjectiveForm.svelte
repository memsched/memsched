<script module lang="ts">
  import { z } from 'zod';

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
        .min(0, { message: "Start value can't be less than 0, please try again." })
        .optional(),
      unit: z.enum(['', 'minutes', 'hours', 'pages', 'words', 'lines'], {
        message: 'Please select a valid unit.',
      }),
      visibility: z.enum(['public', 'private'], {
        message: 'Visibility should be either "public" or "private".',
      }),
      goalType: z.enum(['fixed', 'ongoing'], { message: 'Please select a goal type.' }),
      endValue: z
        .number()
        .min(0, { message: "End value can't be less than 0, please enter a valid value." })
        .optional(),
    })
    .refine((data) => data.unit !== '', {
      message: 'Please select a valid unit.',
      path: ['unit'],
    })
    .refine((data) => data.goalType !== 'fixed' || data.endValue !== undefined, {
      message:
        'Looks like you forgot to add an end value. It\'s required when the goal type is "fixed."',
      path: ['endValue'],
    })
    .refine(
      (data) =>
        data.goalType !== 'fixed' ||
        (data.endValue !== undefined &&
          data.startValue !== undefined &&
          data.endValue > data.startValue),
      {
        message:
          'End value needs to be greater than start value when the goal type is "fixed". Please double-check.',
        path: ['endValue'],
      }
    );

  export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { Icon } from 'svelte-icons-pack';
  import { IoDocumentLockOutline, IoGlobeOutline } from 'svelte-icons-pack/io';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import * as RadioGroup from '$lib/components/ui/radio-group';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { capitalize } from '$lib/utils';

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="w-full space-y-5">
  <section class="space-y-6 first:space-y-3">
    <h3>General</h3>
    <div class="grid grid-cols-2 gap-x-16 gap-y-6">
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name*</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.Description>Give your objective a name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="description">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Textarea
              {...props}
              placeholder="Describe your objective"
              class="resize-none"
              bind:value={$formData.description}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="startValue">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Start Value</Form.Label>
            <Input
              {...props}
              bind:value={$formData.startValue}
              type="number"
              defaultValue={0}
              min={0}
            />
          {/snippet}
        </Form.Control>
        <Form.Description>Set a start value for your objective.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <!-- TODO: Allow for any unit for an objective -->
      <Form.Field {form} name="unit">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Unit*</Form.Label>
            <Select.Root type="single" bind:value={$formData.unit} name={props.name}>
              <Select.Trigger {...props}>
                {$formData.unit ? capitalize($formData.unit) : 'Select a unit'}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="minutes" label="Minutes" />
                <Select.Item value="hours" label="Hours" />
                <Select.Item value="pages" label="Pages" />
                <Select.Item value="words" label="Words" />
                <Select.Item value="lines" label="Lines" />
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.Description>
          Choose a unit for your objective. This will help you track your progress.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Fieldset {form} name="visibility" class="col-span-2 space-y-4">
        <Form.Legend>Visibility</Form.Legend>
        <RadioGroup.Root
          bind:value={$formData.visibility}
          class="flex flex-col space-y-3 *:flex *:items-center *:space-x-4"
          name="visibility"
        >
          <div>
            <Form.Control>
              {#snippet children({ props })}
                <RadioGroup.Item value="public" {...props} />
                <Form.Label class="flex gap-1.5">
                  <Icon src={IoGlobeOutline} className="size-8 *:!stroke-[16px]" />
                  <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Public</div>
                    <div class="font-normal text-muted-foreground">
                      Share your progress with everyone
                    </div>
                  </div>
                </Form.Label>
              {/snippet}
            </Form.Control>
          </div>
          <div>
            <Form.Control>
              {#snippet children({ props })}
                <RadioGroup.Item value="private" {...props} />
                <Form.Label class="flex gap-1.5">
                  <Icon src={IoDocumentLockOutline} className="size-8 *:!stroke-[16px]" />
                  <div class="flex flex-col gap-1.5">
                    <div class="font-medium">Public</div>
                    <div class="font-normal text-muted-foreground">
                      Keep your progress to yourself
                    </div>
                  </div>
                </Form.Label>
              {/snippet}
            </Form.Control>
          </div>
        </RadioGroup.Root>
        <Form.FieldErrors />
      </Form.Fieldset>
      <Form.Fieldset {form} name="goalType" class="space-y-4">
        <Form.Legend>Type</Form.Legend>
        <input type="hidden" name="goalType" bind:value={$formData.goalType} />
        <Tabs.Root bind:value={$formData.goalType}>
          <Tabs.List class="w-full *:w-full">
            <Tabs.Trigger value="fixed">Fixed Goal</Tabs.Trigger>
            <Tabs.Trigger value="ongoing">Ongoing Goal</Tabs.Trigger>
          </Tabs.List>
          <Form.FieldErrors />
          <Tabs.Content value="fixed" class="space-y-6">
            <div class="text-sm text-muted-foreground">
              A goal with a clear endpoint, like "run a marathon" or "read a book."
            </div>
            <Form.Field {form} name="endValue">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>End Value*</Form.Label>
                  <Input {...props} bind:value={$formData.endValue} type="number" min={0} />
                {/snippet}
              </Form.Control>
              <Form.Description>Set a start value for your objective.</Form.Description>
              <Form.FieldErrors />
            </Form.Field>
          </Tabs.Content>
          <Tabs.Content value="ongoing">
            <div class="text-sm text-muted-foreground">
              A goal with an ongoing process, like "learn a new language" or "write blog posts."
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Form.Fieldset>
    </div>
  </section>
  <Form.Button>Create Objective</Form.Button>
</form>
