<script lang="ts">
  import { FiMapPin, FiGlobe } from 'svelte-icons-pack/fi';
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
  const { name, username, avatarUrl, bio, location, website }: Props = $props();
</script>

<div class="sticky h-fit w-[250px] flex-shrink-0" style="top: calc({HEADER_HEIGHT}px + 6.5rem)">
  <div class="relative">
    <UserAvatar {username} {avatarUrl} large />
    <!-- {#if edit} -->
    <!--   <div class="absolute bottom-2 left-2 size-12 rounded-full border-2 bg-back !p-0"></div> -->
    <!-- <Button -->
    <!--   href="/account/settings" -->
    <!--   size="sm" -->
    <!--   class="absolute bottom-2 left-2 size-12 rounded-full border-[3px] border-back !p-0 [&_svg]:size-5" -->
    <!--   variant="translucent" -->
    <!-- > -->
    <!--   <Icon src={FiCamera} className="h-full w-full" /> -->
    <!-- </Button> -->
    <!-- {/if} -->
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
