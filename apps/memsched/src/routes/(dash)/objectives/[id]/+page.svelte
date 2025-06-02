<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FiTrash2 } from 'svelte-icons-pack/fi';
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

  let deleteLoading = $state(false);
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
    <ConfirmDeleteDialog
      action="/objectives/delete"
      name="objectiveId"
      value={page.params.id}
      bind:loading={deleteLoading}
    >
      <Dialog.Trigger>
        {#snippet child({ props })}
          <LoadingButton variant="destructive" icon={FiTrash2} loading={deleteLoading} {...props} />
        {/snippet}
      </Dialog.Trigger>
    </ConfirmDeleteDialog>
  </div>
  <ObjectiveForm {data} edit />
</div>
