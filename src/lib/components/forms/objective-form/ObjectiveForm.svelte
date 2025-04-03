<script lang="ts">
  import { browser } from '$app/environment';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import toast from 'svelte-french-toast';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs/index';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { cn } from '$lib/utils';
  import { formSchema, type FormSchema, OBJECTIVE_UNITS } from './schema';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>> };
    edit?: boolean;
  }

  const { data, edit = false }: Props = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    resetForm: !edit,
    onUpdated({ form }) {
      if (form.message) {
        toast.success(form.message);
      }
    },
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="w-full space-y-5">
  <section class="space-y-6 first:space-y-3">
    <h2 class="h3">General</h2>
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
      <Form.Field {form} name="startValue" class={cn(edit && 'hidden')}>
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
        <Form.Description
          >Set a start value for your objective. This will be the initial total value.</Form.Description
        >
        <Form.FieldErrors />
      </Form.Field>
      <!-- TODO: Allow for any unit for an objective -->
      <Form.Field {form} name="unit">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Unit</Form.Label>
            <Select.Root type="single" bind:value={$formData.unit} name={props.name}>
              <Select.Trigger {...props} class="capitalize">
                {$formData.unit}
              </Select.Trigger>
              <Select.Content>
                {#each OBJECTIVE_UNITS as unit}
                  <Select.Item value={unit} label={unit} class="capitalize" />
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.Description>
          Choose a unit for your objective. This will help you track your progress.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Fieldset {form} name="goalType">
        <Form.Legend>Type</Form.Legend>
        <input type="hidden" name="goalType" bind:value={$formData.goalType} />
        <Tabs.Root bind:value={$formData.goalType} disabled={edit}>
          <Tabs.List class={cn('w-full *:w-full', edit && 'cursor-not-allowed')}>
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
              <Form.Description>Set a end value for your objective.</Form.Description>
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
  {#if edit}
    <Form.Button>Update Objective</Form.Button>
  {:else}
    <Form.Button>Create Objective</Form.Button>
  {/if}
  {#if browser && import.meta.env.VITE_DEBUG_FORMS === '1' && import.meta.env.DEV}
    <SuperDebug data={$formData} />
  {/if}
</form>
