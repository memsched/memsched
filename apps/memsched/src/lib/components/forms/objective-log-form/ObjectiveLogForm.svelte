<script lang="ts">
  import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  import { browser } from '$app/environment';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
  import { Textarea } from '$lib/components/ui/textarea';
  import type { Objective } from '$lib/server/db/schema';

  import { type LogFormSchema, logSchema } from './schema';

  interface Props {
    data: { form: SuperValidated<LogFormSchema> };
    objective: Objective;
    onSuccess?: () => void;
  }

  const { data, objective, onSuccess }: Props = $props();

  const form = $derived(
    superForm(data.form, {
      validators: zod4Client(logSchema),
      resetForm: true,
      onUpdated({ form }) {
        if (form.valid) {
          onSuccess?.();
        }
      },
    })
  );
  const formData = $derived(form.form);
  const enhance = $derived(form.enhance);
  const submitting = $derived(form.submitting);

  // Set the objective ID when the component is mounted
  $effect(() => {
    if (objective) {
      formData.update(($formData) => {
        return { ...$formData, objectiveId: objective.id };
      });
    }
  });
</script>

<form method="POST" action="?/log" use:enhance class="w-full space-y-5">
  <input type="hidden" name="objectiveId" value={$formData.objectiveId || ''} />

  <Form.Field {form} name="value">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Value*</Form.Label>
        <Input
          {...props}
          type="number"
          min="0.01"
          step="0.01"
          bind:value={$formData.value}
          placeholder={`Enter amount in ${objective.unit}`}
        />
      {/snippet}
    </Form.Control>
    <Form.Description>Enter the amount to log for this objective.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="notes">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Notes</Form.Label>
        <Textarea
          {...props}
          placeholder="Add any notes about this log entry"
          class="resize-none"
          bind:value={$formData.notes}
        />
      {/snippet}
    </Form.Control>
    <Form.Description>Optional notes about this log entry.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <LoadingButton type="submit" loading={$submitting}>Log Progress</LoadingButton>
</form>
{#if browser && import.meta.env.VITE_DEBUG_FORMS === '1' && import.meta.env.DEV}
  <SuperDebug data={$formData} />
{/if}
