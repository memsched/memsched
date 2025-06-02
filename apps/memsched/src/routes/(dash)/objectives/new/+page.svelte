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
  import { IoChevronForward } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import { Button } from '$lib/components/ui/button';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Create New Objective - MEMsched"
  description="Create a new learning objective on MEMsched"
  noindex={true}
  nofollow={true}
/>

<DashHeader>
  <Button variant="breadcrumb" size="xs" class="gap-3 pe-0" href="/objectives">
    Objectives
    <Icon src={IoChevronForward} className="!text-muted-foreground" />
  </Button>
  <div class="px-3 text-sm font-medium">New</div>
</DashHeader>

<div class="main-container space-y-6 py-16">
  <h1 class="h2">Create Objective</h1>
  <ObjectiveForm {data} />
</div>
