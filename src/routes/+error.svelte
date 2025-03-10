<script>
  import { page } from '$app/state';
  import { Badge } from '$lib/components/ui/badge';
  import ContactSupportButton from '$lib/components/ContactSupportButton.svelte';
  import { IoArrowBack } from 'svelte-icons-pack/io';
  import AuthLayout from '$lib/components/layouts/AuthLayout.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
</script>

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
        icon={IoArrowBack}
        iconPosition="left"
        class="-animate-svg"
        href="/"
        aria-label="Navigate Home"
      >
        Go Home
      </IconButton>
      {#if page.status !== 404}
        <ContactSupportButton />
      {/if}
    </div>
  </div>
</AuthLayout>
