<script lang="ts">
  import type { PageProps } from './$types';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';

  const { data }: PageProps = $props();
</script>

<HomeLayout class="gap-7">
  <h2>Create Objective</h2>
  <ObjectiveForm {data} />
</HomeLayout>
