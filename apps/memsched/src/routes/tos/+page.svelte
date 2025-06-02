<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
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
