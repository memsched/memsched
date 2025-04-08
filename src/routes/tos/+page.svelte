<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
  import TermsOfService from '$lib/components/markdown/TermsOfService.svelte';
  import { DOMAIN } from '$lib/constants';

  const pageTitle = 'Terms of Service - MEMsched';
  const pageDescription =
    'MEMsched Terms of Service - Read the terms and conditions for using our learning progress tracking platform.';
</script>

<SvelteSeo
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${DOMAIN}/tos`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  title={pageTitle}
  twitter={{
    card: 'summary',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<ContentLayout title="Terms of Service">
  <TermsOfService />
</ContentLayout>
