<!--
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
-->
<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import toast from 'svelte-french-toast';
  import { FiPlus } from 'svelte-icons-pack/fi';
  import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { browser } from '$app/environment';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs/index';
  import { Textarea } from '$lib/components/ui/textarea';

  import { type FormSchema, formSchema, OBJECTIVE_UNITS } from './schema';

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
  const { form: formData, enhance, submitting } = form;
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
    <LoadingButton type="submit" loading={$submitting}>Update Objective</LoadingButton>
  {:else}
    <LoadingButton type="submit" loading={$submitting} icon={FiPlus}>
      Create Objective
    </LoadingButton>
  {/if}
  {#if browser && import.meta.env.VITE_DEBUG_FORMS === '1' && import.meta.env.DEV}
    <SuperDebug data={$formData} />
  {/if}
</form>
