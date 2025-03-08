<script lang="ts">
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import { IoArrowForward } from 'svelte-icons-pack/io';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ShareWidget from '$lib/components/ShareWidget.svelte';

  const { data }: PageProps = $props();
</script>

<HomeLayout class="w-[80%] items-center justify-center gap-6">
  <div class="w-full space-y-2 text-center">
    <h2>Share your new widget</h2>
    <p class="text-sm">You can always get the sharing info when editing the widget.</p>
  </div>
  <div class="flex gap-5">
    <img
      src="/api/widgets/{page.params.id}?svg"
      alt="Widget Preview"
      class="h-[100px] object-contain object-left"
      loading="eager"
    />
    <div class="space-y-4">
      <ShareWidget
        title={data.widget.title}
        subtitle={data.widget.subtitle}
        username={data.user.username}
      />
      <IconButton icon={IoArrowForward} href="/widgets">Return to Widgets</IconButton>
    </div>
  </div>
</HomeLayout>
