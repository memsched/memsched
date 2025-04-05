<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';
  import ShareWidget from '$lib/components/ShareWidget.svelte';
  import SvelteSeo from 'svelte-seo';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Edit Widget - MEMsched"
  description="Edit your learning progress widget on MEMsched"
  noindex={true}
  nofollow={true}
/>

<div class="main-container space-y-7 py-16">
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
  {#if data.form.data.visibility === 'public'}
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
</div>
