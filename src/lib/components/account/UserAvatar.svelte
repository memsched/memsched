<script lang="ts">
  import { onMount } from 'svelte';

  import { cn } from '$lib/utils';

  import Avvvatars from '../avvvatars/Avvvatars.svelte';

  interface Props {
    username: string;
    avatarUrl: string | null;
    large?: boolean;
  }

  const { username, avatarUrl, large = false }: Props = $props();

  let useCustomAvatar = $state(false);

  onMount(() => {
    if (avatarUrl) {
      fetch(avatarUrl, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            useCustomAvatar = true;
          } else {
            useCustomAvatar = false;
          }
        })
        .catch(() => {
          useCustomAvatar = false;
        });
    } else {
      useCustomAvatar = false;
    }
  });
</script>

{#if useCustomAvatar && avatarUrl}
  <img
    class={cn('inline-block rounded-full', large ? 'size-[250px] ring-2 ring-border' : 'size-8')}
    src={avatarUrl}
    alt="User profile avatar"
  />
{:else}
  <Avvvatars value={username} size={large ? 250 : 32} style="shape" />
{/if}
