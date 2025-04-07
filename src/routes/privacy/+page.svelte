<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
  import PrivaryPolicy from '$lib/components/markdown/PrivaryPolicy.svelte';
  import { DOMAIN } from '$lib/constants';

  const pageTitle = 'Privacy Policy - MEMsched';
  const pageDescription =
    'MEMsched Privacy Policy - Learn how we protect your data and privacy when using our learning progress tracking platform.';
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${DOMAIN}/privacy`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  twitter={{
    card: 'summary',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<ContentLayout title="Privacy Policy">
  <PrivaryPolicy />
</ContentLayout>
