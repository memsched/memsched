<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  const { data }: PageProps = $props();
</script>

<div class="flex h-full w-full flex-col items-start gap-7">
  <div class="flex w-full items-center justify-between">
    <h2>Edit Widget</h2>
    <ConfirmDeleteDialog action="/widgets/delete" name="widgetId" value={page.params.id}>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <IconButton icon={FiTrash2} variant="destructive" {...props}>Delete</IconButton>
        {/snippet}
      </Dialog.Trigger>
    </ConfirmDeleteDialog>
  </div>
  <WidgetForm {data} edit />
</div>
