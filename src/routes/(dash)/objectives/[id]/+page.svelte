<script lang="ts">
  import { FiTrash2 } from 'svelte-icons-pack/fi';
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import IconButton from '$lib/components/ui/IconButton.svelte';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Edit Objective - MEMsched"
  description="Edit your learning objective on MEMsched"
  noindex={true}
  nofollow={true}
/>

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
