<script lang="ts">
  import type { PageData } from './$types';
  import ObjectiveForm from '$lib/components/forms/objective-form/ObjectiveForm.svelte';

  const { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full flex-col items-start gap-7">
  <h2>Create Objective</h2>
  <ObjectiveForm {data} />
</div>
