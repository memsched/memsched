<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Edit Widget - MEMsched"
  description="Edit your learning progress widget on MEMsched"
  noindex={true}
  nofollow={true}
/>

<WidgetForm {data} edit />
