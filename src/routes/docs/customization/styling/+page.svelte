<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  const pageTitle = 'Widget Styling Guide - MEMsched Documentation';
  const pageDescription =
    'Learn how to customize the appearance of your MEMsched widgets. Comprehensive guide to styling options and customization features.';
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    type: 'article',
  }}
  twitter={{
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
    site: '@memsched',
  }}
/>

<div class="space-y-4">
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Styling</h1>
  <p class="text-xl text-muted-foreground">Customize the appearance of your MEMsched widget.</p>
</div>
