<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
  import TermsOfService from '$lib/components/markdown/TermsOfService.svelte';

  const pageTitle = 'Terms of Service - MEMsched';
  const pageDescription =
    'MEMsched Terms of Service - Read the terms and conditions for using our learning progress tracking platform.';
</script>

<SvelteSeo
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${page.url.origin}/tos`,
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

<ContentLayout title="Terms of Service">
  <TermsOfService />
</ContentLayout>
