<script lang="ts">
  import type { PageProps } from './$types';
  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import SvelteSeo from 'svelte-seo';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Create New Widget - MEMsched"
  description="Create a new learning progress widget to showcase your skills"
  noindex={true}
  nofollow={true}
/>

<HomeLayout class="gap-7">
  <h2>Create Widget</h2>
  <WidgetForm {data} />
</HomeLayout>
