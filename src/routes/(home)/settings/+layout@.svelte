<script lang="ts">
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';

  const tabs = [
    { name: 'Public Profile', href: '/settings/profile' },
    { name: 'Account', href: '/settings/account' },
  ];
  const { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <HomeHeader />
  <HomeLayout container={false} class="flex">
    <div
      class="sticky flex items-center border-b bg-background"
      style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
    >
      <div class="mx-auto flex w-full max-w-screen-xl gap-4 px-6 lg:px-10">
        {#each tabs as tab}
          <TabNavLink {...tab} />
        {/each}
      </div>
    </div>
    <div class="mx-auto w-full max-w-screen-lg px-6 py-12 lg:px-10">
      {@render children()}
    </div>
  </HomeLayout>
</div>
