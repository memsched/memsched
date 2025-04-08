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
