<script>
  import { IoArrowBack } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import ContactSupportButton from '$lib/components/ContactSupportButton.svelte';
  import AuthLayout from '$lib/components/layouts/AuthLayout.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import IconButton from '$lib/components/ui/IconButton.svelte';

  const pageTitle = page.status === 404 ? 'Page Not Found - MEMsched' : 'Error - MEMsched';
  const pageDescription =
    page.status === 404 ? "The page you're looking for doesn't exist." : 'Something went wrong.';
</script>

<SvelteSeo
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${page.url.origin}${page.url.pathname}`,
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

<AuthLayout>
  <div class="flex flex-col items-center text-center">
    <div>
      <Badge class="mb-3 text-sm" variant="translucent">{page.status}</Badge>
      {#if page.status === 404}
        <h1 class="mb-3 text-4xl font-bold md:text-6xl">Page Not Found</h1>
        <p class="mb-8 text-muted-foreground md:text-xl">This page doesn&apos;t exist 😅</p>
      {:else}
        <h1 class="mb-3 text-4xl font-bold md:text-6xl">Something went wrong</h1>
        <p class="mb-8 text-muted-foreground md:text-xl">
          {page.error?.message}
        </p>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      <IconButton
        class="-animate-svg"
        aria-label="Navigate Home"
        href="/"
        icon={IoArrowBack}
        iconPosition="left"
      >
        Go Home
      </IconButton>
      {#if page.status !== 404}
        <ContactSupportButton />
      {/if}
    </div>
  </div>
</AuthLayout>
