<script lang="ts">
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { IoChevronForward } from 'svelte-icons-pack/io';

  const tabs = [
    { name: 'Public Profile', href: '/settings/profile' },
    { name: 'Account', href: '/settings/account' },
  ];
  const { children } = $props();
</script>

<DashHeader>
  <div class="px-3 text-sm font-medium text-muted-foreground">Settings</div>
  <Icon src={IoChevronForward} className="!text-muted-foreground" />
  {#each tabs as tab}
    <TabNavLink {...tab} />
  {/each}
</DashHeader>
<div class="main-container overflow-y-auto py-10">
  {@render children()}
</div>
