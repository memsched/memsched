<script lang="ts">
  import type { PageProps } from './$types';
  import SvelteSeo from 'svelte-seo';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Create New Widget - MEMsched"
  description="Create a new learning progress widget to showcase your skills"
  noindex={true}
  nofollow={true}
/>

<WidgetForm {data} />
