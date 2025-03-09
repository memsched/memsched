<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index';
  import { type SuperValidated } from 'sveltekit-superforms';
  import { type LogFormSchema } from '$lib/components/forms/objective-log-form/schema';
  import ObjectiveLogForm from '$lib/components/forms/objective-log-form/ObjectiveLogForm.svelte';
  import type { Objective } from '$lib/server/db/schema';
  import { Button } from '$lib/components/ui/button/index';
  import { Icon } from 'svelte-icons-pack';
  import { FiPlusCircle } from 'svelte-icons-pack/fi';

  interface Props {
    form: SuperValidated<LogFormSchema>;
    objective: Objective;
  }

  const { form, objective }: Props = $props();

  let open = $state(false);

  function handleSuccess() {
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ ...props })}
      <Button
        size="xs"
        variant="secondary"
        class="flex items-center gap-1"
        {...props}
        onclick={() => (open = true)}
      >
        <Icon src={FiPlusCircle} size="14" />
        Custom
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Log Progress for {objective.name}</Dialog.Title>
      <Dialog.Description>
        Enter the amount of progress you want to log for this objective.
      </Dialog.Description>
    </Dialog.Header>
    <ObjectiveLogForm data={{ form }} {objective} onSuccess={handleSuccess} />
  </Dialog.Content>
</Dialog.Root>
