<script lang="ts">
  import { cn } from '$lib/utils';
  import Avvvatars from '../avvvatars/Avvvatars.svelte';

  interface Props {
    username: string;
    avatarUrl: string | null;
    large?: boolean;
  }

  const { username, avatarUrl, large = false }: Props = $props();
</script>

{#if avatarUrl}
  <img
    class={cn('inline-block rounded-full ring-2 ring-white', large ? 'size-[250px]' : 'size-8')}
    src={avatarUrl}
    alt="User profile avatar"
  />
{:else}
  <Avvvatars value={username} size={large ? 250 : 32} style="shape" />
{/if}
