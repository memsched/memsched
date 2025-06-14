<script lang="ts">
  import { toast } from 'svelte-french-toast';
  import SvelteSeo from 'svelte-seo';

  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  import type { PageProps } from './$types';

  const { data, form }: PageProps = $props();

  $effect(() => {
    if (form?.error) {
      toast.error(form.error);
    }
  });
</script>

<SvelteSeo
  title="Edit Widget - MEMsched"
  description="Edit your learning progress widget on MEMsched"
  noindex={true}
  nofollow={true}
/>

<WidgetForm {data} edit />
