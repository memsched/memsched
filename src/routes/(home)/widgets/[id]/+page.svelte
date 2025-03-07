<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const { data }: PageProps = $props();
  const userUrl = page.url.origin + '/' + data.user.username;
  const widgetUrl = page.url.origin + '/api/widgets/' + page.params.id;
  const htmlSnippet = $derived(
    `
<a href="${userUrl}" target="_blank">
    <img src="${widgetUrl}?svg" 
         alt="${data.form.data.title}${data.form.data.subtitle ? ' - ' + data.form.data.subtitle : ''}"
         height="80px"
    />
</a>
`.trim()
  );
</script>

<HomeLayout class="gap-7">
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

  <div class="space-y-4">
    <h3>Sharing</h3>
    <div class="space-y-2">
      <CodeBlock code={htmlSnippet} />
      <div class="text-sm text-muted-foreground">
        Copy the code above and paste it into your markdown or website.
      </div>
    </div>
  </div>
  <WidgetForm {data} edit />
</HomeLayout>
