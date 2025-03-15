<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import * as Dialog from '$lib/components/ui/dialog';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';

  const { data }: PageProps = $props();
</script>

<HomeLayout class="gap-7">
  <div class="flex w-full items-center justify-between">
    <h1 class="h2">Edit Objective</h1>
    <ConfirmDeleteDialog action="/objectives/delete" name="objectiveId" value={page.params.id}>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <IconButton icon={FiTrash2} variant="destructive" {...props}>Delete</IconButton>
        {/snippet}
      </Dialog.Trigger>
    </ConfirmDeleteDialog>
  </div>
  <ObjectiveForm {data} edit />
</HomeLayout>
