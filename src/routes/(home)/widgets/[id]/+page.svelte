<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';
  import ShareWidget from '$lib/components/ShareWidget.svelte';

  const { data }: PageProps = $props();
</script>

<HomeLayout class="gap-7">
  <div class="flex w-full items-center justify-between">
    <h1 class="h2">Edit Widget</h1>
    <ConfirmDeleteDialog action="/widgets/delete" name="widgetId" value={page.params.id}>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <IconButton icon={FiTrash2} variant="destructive" {...props}>Delete</IconButton>
        {/snippet}
      </Dialog.Trigger>
    </ConfirmDeleteDialog>
  </div>
  {#if data.objectives.find((o) => o.id === data.form.data.objectiveId)?.visibility === 'public'}
    <div class="space-y-4">
      <h2 class="h3">Sharing</h2>
      <ShareWidget
        title={data.form.data.title}
        subtitle={data.form.data.subtitle}
        username={data.user.username}
      />
    </div>
  {/if}
  <WidgetForm {data} edit />
</HomeLayout>
