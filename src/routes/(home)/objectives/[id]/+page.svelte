<script lang="ts">
  import type { PageProps } from './$types';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';

  const { data }: PageProps = $props();
</script>

<div class="flex h-full w-full flex-col items-start gap-7">
  <h2>Edit Objective</h2>
  <ObjectiveForm {data} edit />
</div>
