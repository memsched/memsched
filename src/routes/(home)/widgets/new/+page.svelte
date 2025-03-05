<script lang="ts">
  import type { PageProps } from './$types';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  const { data }: PageProps = $props();
</script>

<div class="flex h-full w-full flex-col items-start gap-7">
  <h2>Create Widget</h2>
  <WidgetForm {data} />
</div>
