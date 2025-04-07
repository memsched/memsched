<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Create New Widget - MEMsched"
  description="Create a new learning progress widget to showcase your skills"
  noindex={true}
  nofollow={true}
/>

<WidgetForm {data} />
