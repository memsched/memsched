<script lang="ts">
  import { FiCamera } from 'svelte-icons-pack/fi';
  import IconButton from '../ui/IconButton.svelte';
  import UserAvatar from './UserAvatar.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';

  interface Props {
    username: string;
    name: string;
    avatarUrl: string | null;
    edit: boolean;
  }
  const { name, username, avatarUrl, edit }: Props = $props();
</script>

<div class="sticky h-fit w-[250px] flex-shrink-0" style="top: calc({HEADER_HEIGHT}px + 5rem)">
  <div class="relative">
    <UserAvatar {username} {avatarUrl} large />
    {#if edit}
      <IconButton
        href="/account/settings"
        icon={FiCamera}
        class="absolute bottom-0 left-0 border-2 border-background text-base hover:bg-gray-800 [&_svg]:ms-1 [&_svg]:size-5"
      >
        Edit
      </IconButton>
    {/if}
  </div>
  <h2 class="mt-8">{name}</h2>
  <p class="text-lg text-muted-foreground">{username}</p>
  <p class="mt-5">This is your public profile page. You can add widgets to your profile here.</p>
</div>
