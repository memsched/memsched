<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { IoChevronForward } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import LoadingButton from '$lib/components/ui/LoadingButton.svelte';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Edit Objective - MEMsched"
  description="Edit your learning objective on MEMsched"
  noindex={true}
  nofollow={true}
/>

<DashHeader>
  <Button variant="breadcrumb" size="xs" class="gap-3 pe-0" href="/objectives">
    Objectives
    <Icon src={IoChevronForward} className="!text-muted-foreground" />
  </Button>
  <div class="px-3 text-sm font-medium">Edit</div>
</DashHeader>

<div class="main-container space-y-6 py-16">
  <div class="flex w-full items-center justify-between">
    <h1 class="h2">Edit Objective</h1>
    <ConfirmDeleteDialog action="/objectives/delete" name="objectiveId" value={page.params.id}>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <LoadingButton variant="destructive" {...props}>Delete</LoadingButton>
        {/snippet}
      </Dialog.Trigger>
    </ConfirmDeleteDialog>
  </div>
  <ObjectiveForm {data} edit />
</div>
