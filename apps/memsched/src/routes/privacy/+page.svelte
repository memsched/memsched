<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
  import PrivaryPolicy from '$lib/components/markdown/PrivaryPolicy.svelte';

  const pageTitle = 'Privacy Policy - MEMsched';
  const pageDescription =
    'MEMsched Privacy Policy - Learn how we protect your data and privacy when using our learning progress tracking platform.';
</script>

<SvelteSeo
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${page.url.origin}/privacy`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  title={pageTitle}
  twitter={{
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<ContentLayout title="Privacy Policy">
  <PrivaryPolicy />
</ContentLayout>
