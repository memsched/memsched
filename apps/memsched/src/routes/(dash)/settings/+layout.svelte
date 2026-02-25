<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { IoChevronForward } from 'svelte-icons-pack/io';

  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';

  const tabs = [
    { name: 'Public Profile', href: '/settings/profile' },
    { name: 'Account', href: '/settings/account' },
  ];
  const { children } = $props();
</script>

<DashHeader>
  <div class="text-muted-foreground px-3 text-sm font-medium">Settings</div>
  <Icon className="!text-muted-foreground" src={IoChevronForward} />
  {#each tabs as tab}
    <TabNavLink {...tab} />
  {/each}
</DashHeader>
<div class="main-container overflow-y-auto py-10">
  {@render children()}
</div>
