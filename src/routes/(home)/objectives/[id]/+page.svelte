<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import * as Dialog from '$lib/components/ui/dialog';

  const { data }: PageProps = $props();
</script>

<div class="flex h-full w-full flex-col items-start gap-7">
  <div class="flex w-full items-center justify-between">
    <h2>Edit Objective</h2>
    <ConfirmDeleteDialog action="/objectives/delete" name="objectiveId" value={page.params.id}>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <IconButton icon={FiTrash2} variant="destructive" {...props}>Delete</IconButton>
        {/snippet}
      </Dialog.Trigger>
    </ConfirmDeleteDialog>
  </div>
  <ObjectiveForm {data} edit />
</div>
