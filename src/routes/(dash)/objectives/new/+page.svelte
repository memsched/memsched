<script lang="ts">
  import type { PageProps } from './$types';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import SvelteSeo from 'svelte-seo';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Create New Objective - MEMsched"
  description="Create a new learning objective on MEMsched"
  noindex={true}
  nofollow={true}
/>

<HomeLayout class="gap-7">
  <h1 class="h2">Create Objective</h1>
  <ObjectiveForm {data} />
</HomeLayout>
