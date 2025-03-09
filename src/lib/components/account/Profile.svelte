<script lang="ts">
  import { FiCamera, FiMapPin, FiGlobe } from 'svelte-icons-pack/fi';
  import IconButton from '../ui/IconButton.svelte';
  import UserAvatar from './UserAvatar.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { Icon } from 'svelte-icons-pack';

  interface Props {
    username: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    edit: boolean;
  }
  const { name, username, avatarUrl, bio, location, website, edit }: Props = $props();
</script>

<div class="sticky h-fit w-[250px] flex-shrink-0" style="top: calc({HEADER_HEIGHT}px + 6.5rem)">
  <div class="relative">
    <UserAvatar {username} {avatarUrl} large />
    {#if edit}
      <IconButton
        href="/account/settings"
        icon={FiCamera}
        size="sm"
        class="border-back absolute bottom-0 left-0 border-2 hover:bg-blue-700"
      >
        Edit
      </IconButton>
    {/if}
  </div>
  <h2 class="mt-8">{name}</h2>
  <p class="text-lg text-muted-foreground">{username}</p>

  {#if bio}
    <p class="mt-5">{bio}</p>
  {/if}

  <div class="mt-4 flex flex-col gap-2">
    {#if location}
      <div class="flex items-center gap-2 text-muted-foreground">
        <Icon src={FiMapPin} className="size-4" />
        <span>{location}</span>
      </div>
    {/if}

    {#if website}
      <div class="flex items-center gap-2 text-muted-foreground">
        <Icon src={FiGlobe} className="size-4" />
        <a href={website} target="_blank" rel="noopener noreferrer" class="hover:underline">
          {website.replace(/^https?:\/\//, '')}
        </a>
      </div>
    {/if}
  </div>
</div>
